# Common Python Shared Package (`common-py`)

Thư mục chứa các module dùng chung giữa các dịch vụ Python (`orchestrator-service`, `gateway-service`, `scanner-worker`, `auth-service`):

- `schemas/`: Pydantic V2 models (`VulnerabilityFinding`, `ScanTargetRequest`, `AgentScanState`).
- `security/`: Bộ giải mã JWT, module xác thực SSRF `safe_http_client.py`.
- `database/`: SQLAlchemy base model, engine connection pooling, session management.
- `logger/`: Structured JSON logging chuẩn OpenTelemetry.
