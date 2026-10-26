from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from knowledge.owasp_wstg import query_knowledge_base, get_remediation_by_cwe, KNOWLEDGE_BASE

router = APIRouter(prefix="/api/v1/rag", tags=["Knowledge RAG"])

class QueryRequest(BaseModel):
    query: str
    limit: Optional[int] = 5

class ChatRequest(BaseModel):
    question: str
    context: Optional[Dict[str, Any]] = None

@router.post("/query")
def search_knowledge(req: QueryRequest):
    results = query_knowledge_base(req.query)
    return {
        "query": req.query,
        "count": len(results),
        "matches": results[:req.limit]
    }

@router.get("/remediation/{cwe_id}")
def get_remediation(cwe_id: str):
    res = get_remediation_by_cwe(cwe_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy hướng dẫn khắc phục cho {cwe_id}"
        )
    return res

@router.post("/copilot/chat")
def copilot_chat(req: ChatRequest):
    q = req.question.lower()
    matched_cwes = []
    
    if "cors" in q or "origin" in q:
        matched_cwes.append("CWE-942")
    if "header" in q or "csp" in q or "hsts" in q:
        matched_cwes.append("CWE-693")
    if "server" in q or "version" in q or "banner" in q:
        matched_cwes.append("CWE-200")

    if matched_cwes:
        first_cwe = KNOWLEDGE_BASE[matched_cwes[0]]
        answer = (
            f"Về câu hỏi '{req.question}': Dựa trên cơ sở tri thức OWASP {first_cwe['owasp_category']} ({first_cwe['cwe_id']}), "
            f"rủi ro chính là: {first_cwe['impact']} "
            f"Phương án khắc phục khuyến nghị: {first_cwe['description']}"
        )
        return {
            "answer": answer,
            "references": [first_cwe['wstg_code'], first_cwe['cwe_id']],
            "snippets": first_cwe['remediation']
        }

    return {
        "answer": f"AegisOps Copilot đã phân tích yêu cầu '{req.question}'. Để đảm bảo an toàn cho ứng dụng, bạn nên tuân thủ nguyên tắc Defense-in-Depth: kích hoạt bộ 6 Security Headers, thiết lập CORS Whitelist nghiêm ngặt và không lộ thông tin phần mềm máy chủ.",
        "references": ["OWASP WSTG v4.2"],
        "snippets": {}
    }
