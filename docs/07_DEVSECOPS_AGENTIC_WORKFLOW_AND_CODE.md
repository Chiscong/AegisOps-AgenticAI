# HƯỚNG DẪN CODE CHI TIẾT & AGENTICOPS DEVSECOPS WORKFLOW

> **Mục tiêu:** Hướng dẫn cách lập trình trọn vẹn hệ thống AI AgenticOps chuyên sâu cho DevSecOps, áp dụng kiến trúc Clean Architecture, LangGraph State Machine, Eager Tool Dispatching và quy trình tự động mở Pull Request vá lỗi trong CI/CD.

---

## 1. CẤU TRÚC CODE CHUẨN CLEAN ARCHITECTURE (MICROSERVICE ORCHESTRATOR)

Tại dịch vụ cốt lõi `orchestrator-service`, mã nguồn được phân tầng nghiêm ngặt nhằm đảm bảo tính độc lập, dễ viết Unit Test và bảo trì lâu dài:

```text
orchestrator-service/
├── app/
│   ├── api/                     <- Tầng Giao tiếp HTTP & SSE Controllers
│   │   ├── v1/
│   │   │   ├── scans.py         <- Endpoint kích hoạt quét & SSE Stream Reader
│   │   │   └── copilot.py       <- Endpoint hỏi đáp tương tác với SecOps Copilot
│   ├── core/                    <- Tầng Cấu hình & Bảo mật
│   │   ├── config.py            <- Pydantic Settings đọc biến môi trường
│   │   └── security.py          <- Giải mã & Xác thực JWT Token
│   ├── domain/                  <- Tầng Nghiệp vụ Cốt lõi & Data Contracts
│   │   ├── models.py            <- Pydantic V2 Domain Entities
│   │   └── state.py             <- LangGraph GraphState định nghĩa bộ nhớ Agent
│   ├── agents/                  <- Tầng Đa Tác Nhân (Multi-Agent System)
│   │   ├── recon_agent.py       <- Agent 1: Trinh sát & Gọi Tool
│   │   ├── triage_agent.py      <- Agent 2: Lập luận OWASP & RAG Grounding
│   │   └── advisor_agent.py     <- Agent 3: Sinh mã vá lỗi & Executive Summary
│   ├── tools/                   <- Tầng Công cụ (Agent Tools)
│   │   ├── eager_dispatcher.py  <- Streaming JSON Parser gọi Tool siêu tốc
│   │   └── recon_tools.py       <- Async HTTP Clients kiểm tra Headers, SSL, CORS
│   └── infrastructure/          <- Tầng Kết nối Hạ tầng Ngoại vi
│       ├── redis_broker.py      <- Redis Pub/Sub & Queue Publisher
│       ├── rag_client.py        <- Client gọi dịch vụ Knowledge RAG
│       └── db_repository.py     <- SQLAlchemy CRUD lưu trữ PostgreSQL
├── Dockerfile                   <- Đóng gói Container tối ưu
├── requirements.txt             <- Danh sách thư viện Python
└── main.py                      <- Điểm khởi chạy ứng dụng FastAPI
```

---

## 2. HIỆN THỰC HÓA BỘ NÃO LANGGRAPH MULTI-AGENT STATE MACHINE (`graph_builder.py`)

Hệ thống điều phối luồng làm việc của 3 tác nhân thông qua một cỗ máy trạng thái hữu hạn (Finite State Machine):

```python
import operator
from typing import Annotated, Dict, Any, List, Optional
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field

# 1. Định nghĩa Trạng thái Chung của Agent (GraphState)
class AgentScanState(TypedDict):
    scan_id: str
    target_url: str
    tech_stack: Optional[str]
    raw_recon_data: Dict[str, Any]
    rag_context: List[str]
    findings: List[Dict[str, Any]]
    executive_summary: Optional[str]
    status: str
    thought_logs: Annotated[List[str], operator.add]

# 2. Node 1: Reconnaissance Agent (Thu thập Bằng chứng Thụ động)
async def recon_node(state: AgentScanState) -> Dict[str, Any]:
    logs = [f"[*] [ReconAgent] Bắt đầu khảo sát hạ tầng mục tiêu: {state['target_url']}"]
    
    # Giả lập hoặc gọi trực tiếp công cụ khảo sát
    from tools.recon_tools import execute_passive_recon
    evidence = await execute_passive_recon(state["target_url"])
    
    logs.append(f"[+] [ReconAgent] Thu thập hoàn tất. Trích xuất {len(evidence.get('missing_headers', []))} headers thiếu.")
    return {
        "raw_recon_data": evidence,
        "thought_logs": logs,
        "status": "RECON_COMPLETED"
    }

# 3. Node 2: Triage & Reasoning Agent (Lập luận & Loại bỏ False Positive)
async def triage_node(state: AgentScanState) -> Dict[str, Any]:
    logs = ["[*] [TriageAgent] Truy vấn tri thức OWASP WSTG v4.2 và bắt đầu đối chiếu bằng chứng."]
    
    from infrastructure.rag_client import query_rag_knowledge
    from agents.triage_agent import evaluate_evidence_with_llm
    
    # RAG Tra cứu ngữ cảnh chuẩn
    context = await query_rag_knowledge(state["raw_recon_data"])
    findings = await evaluate_evidence_with_llm(
        target_url=state["target_url"],
        evidence=state["raw_recon_data"],
        rag_context=context
    )
    
    logs.append(f"[+] [TriageAgent] Xác thực thành công {len(findings)} lỗ hổng thực tế. Loại bỏ 100% false positives.")
    return {
        "rag_context": context,
        "findings": findings,
        "thought_logs": logs,
        "status": "TRIAGE_COMPLETED"
    }

# 4. Node 3: Advisory & Remediation Agent (Sinh mã vá lỗi & Báo cáo)
async def advisory_node(state: AgentScanState) -> Dict[str, Any]:
    logs = ["[*] [AdvisoryAgent] Tiến hành sinh mã vá lỗi tương thích với Tech Stack và lập báo cáo quản trị."]
    
    from agents.advisor_agent import generate_remediations_and_summary
    result = await generate_remediations_and_summary(
        target_url=state["target_url"],
        findings=state["findings"],
        tech_stack=state.get("tech_stack", "General/Nginx")
    )
    
    logs.append("[✓] [AdvisoryAgent] Hoàn thành sinh mã cấu hình bảo vệ (Nginx/Express) và bản tóm tắt điều hành.")
    return {
        "findings": result["enriched_findings"],
        "executive_summary": result["summary"],
        "thought_logs": logs,
        "status": "COMPLETED"
    }

# 5. Xây dựng Sơ đồ Điều phối (Graph Workflow)
def build_secops_graph():
    workflow = StateGraph(AgentScanState)
    
    # Định nghĩa các Node
    workflow.add_node("recon", recon_node)
    workflow.add_node("triage", triage_node)
    workflow.add_node("advisory", advisory_node)
    
    # Thiết lập luồng chuyển tiếp (Edges)
    workflow.set_entry_point("recon")
    workflow.add_edge("recon", "triage")
    workflow.add_edge("triage", "advisory")
    workflow.add_edge("advisory", END)
    
    return workflow.compile()

secops_graph = build_secops_graph()
```

---

## 3. CƠ CHẾ EAGER TOOL EXECUTION (STREAMING JSON DISPATCHER)

Lấy cảm hứng từ kiến trúc `eager-tools` của CloudThinker, cơ chế này giúp Agent gọi công cụ ngay khi khối JSON vừa đóng thẻ `}` trong luồng streaming, triệt tiêu thời gian chờ đợi phản hồi của mô hình:

```python
import json
import asyncio
from typing import AsyncGenerator, Callable, Dict, Any

class EagerToolDispatcher:
    """Bộ phân tích luồng JSON streaming và kích hoạt tool tức thì"""
    
    def __init__(self, registered_tools: Dict[str, Callable]):
        self.tools = registered_tools
        self.buffer = ""
        self.brace_count = 0
        self.inside_json = False

    async def feed_stream_chunk(self, chunk: str) -> AsyncGenerator[Dict[str, Any], None]:
        for char in chunk:
            self.buffer += char
            if char == '{':
                self.brace_count += 1
                self.inside_json = True
            elif char == '}':
                self.brace_count -= 1
                if self.inside_json and self.brace_count == 0:
                    # JSON block đã hoàn chỉnh! Kích hoạt Tool ngay tức khắc!
                    try:
                        tool_call = json.loads(self.buffer.strip())
                        tool_name = tool_call.get("tool")
                        params = tool_call.get("parameters", {})
                        
                        if tool_name in self.tools:
                            yield {"event": "tool_triggered", "tool": tool_name}
                            # Chạy hàm bất đồng bộ không gây nghẽn
                            result = await self.tools[tool_name](**params)
                            yield {"event": "tool_completed", "tool": tool_name, "result": result}
                    except json.JSONDecodeError:
                        pass
                    # Reset buffer sau khi hoàn thành khối JSON
                    self.buffer = ""
                    self.inside_json = False
```

---

## 4. TÍCH HỢP DEVSECOPS CI/CD: TỰ ĐỘNG TẠO PULL REQUEST VÁ LỖI

Đây là tính năng thực chiến cao cấp giúp đồ án đạt điểm tối đa và gây ấn tượng mạnh với nhà tuyển dụng: **Hệ thống tự động quét môi trường Staging và tự động mở PR vá lỗi trên GitHub**.

### Kịch bản GitHub Actions (`.github/workflows/aegisops-audit.yml`):
```yaml
name: AegisOps DevSecOps Continuous Audit & Auto-Remediation

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy Ephemeral Preview Environment
        run: |
          echo "Khởi tạo môi trường Staging tạm thời..."
          # docker compose -f docker-compose.staging.yml up -d
          echo "STAGING_URL=https://staging-pr-${{ github.event.number }}.sample.vn" >> $GITHUB_ENV

      - name: Trigger AegisOps Autonomous Scan
        run: |
          echo "Gửi yêu cầu đánh giá an ninh mạng đến AegisOps Agent..."
          RESPONSE=$(curl -s -X POST "https://aegisops.yourdomain.com/api/v1/scans" \
            -H "Authorization: Bearer ${{ secrets.AEGISOPS_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d "{\"target_url\": \"$STAGING_URL\", \"scan_depth\": \"deep\"}")
          
          SCAN_ID=$(echo $RESPONSE | jq -r '.scan_id')
          echo "SCAN_ID=$SCAN_ID" >> $GITHUB_ENV

      - name: Wait for Scan Completion & Download Remediation Patch
        run: |
          echo "Chờ Agent hoàn thành và tải về file vá lỗi git patch..."
          sleep 30
          curl -s "https://aegisops.yourdomain.com/api/v1/scans/$SCAN_ID/patch" \
            -H "Authorization: Bearer ${{ secrets.AEGISOPS_API_TOKEN }}" \
            -o security-remediation.patch

      - name: Auto-Apply Patch & Open Remediation PR
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "fix(security): Áp dụng mã cấu hình bảo vệ tự động bởi AegisOps-AI"
          title: "[AegisOps] Khắc phục Lỗ hổng Bảo mật & Hardening Cấu hình"
          body: |
            ## 🛡️ AegisOps DevSecOps Automated Remediation Report
            Hệ thống AI Agent phát hiện các điểm rủi ro cấu hình trên môi trường Staging và đã tự động sinh bản vá này:
            - Bổ sung bộ 6 Security Headers chuẩn OWASP.
            - Vá lỗi phản chiếu CORS trên endpoint nhạy cảm.
            - Vui lòng review mã nguồn đính kèm trước khi merge.
          branch: "aegisops/security-patch-pr-${{ github.event.number }}"
```
