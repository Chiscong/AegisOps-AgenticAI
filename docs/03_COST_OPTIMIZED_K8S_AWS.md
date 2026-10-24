# HƯỚNG DẪN TRIỂN KHAI KUBERNETES 2-3 NODES TỐI ƯU CHI PHÍ TRÊN AWS (< $15/THÁNG)

> **Mô hình triển khai:** Cụm Kubernetes tự quản trị (Self-Managed K3s Cluster) trên 2 - 3 Node giá rẻ (Tương tự hạ tầng thực chiến của hệ thống `hubt-connect`).

---

## 1. Bài toán Tối ưu Chi phí: Tự dựng K3s vs AWS EKS Managed

Khi đi phỏng vấn hoặc bảo vệ đồ án tốt nghiệp, giảng viên và nhà tuyển dụng rất hay hỏi:
> *"Tại sao em không dùng AWS EKS (Amazon Elastic Kubernetes Service) của hãng?"*

### Bảng so sánh chi phí thực tế (Chi phí 1 tháng):

| Hạng mục chi phí | Dùng AWS EKS Tiêu chuẩn | Dùng K3s Cụm 2-3 Node (Mô hình AegisOps / Hubt-Connect) |
| :--- | :--- | :--- |
| **Phí duy trì Control Plane** | **$73.00 / tháng** (Bắt buộc trả cho AWS dù không chạy pod nào) | **$0.00** (K3s Server tích hợp siêu nhẹ, dùng < 512MB RAM) |
| **Máy chủ tính toán (Compute)** | 2 x `t3.medium` On-Demand: **~$60.00 / tháng** | 2-3 node `t4g.small` (ARM Graviton) hoặc Lightsail: **$10 - $15 / tháng** |
| **Ổ đĩa lưu trữ (Storage)** | AWS EBS gp3 dynamic provisioner: **~$10.00 / tháng** | Local-Path Provisioner (ghi trực tiếp vào ổ SSD của máy): **$0.00** |
| **Bộ cân bằng tải (Load Balancer)** | AWS Application Load Balancer (ALB): **~$22.00 / tháng** | Nginx Ingress Controller (HostPort / NodePort) + DuckDNS/Cloudflare: **$0.00** |
| **Chứng chỉ SSL/TLS** | AWS ACM (cần ALB để gắn) | Cert-Manager tự động gia hạn Let's Encrypt miễn phí: **$0.00** |
| **TỔNG CHI PHÍ DỰ KIẾN** | **~$165 - $200 / THÁNG** *(Vượt quá ngân sách sinh viên)* | **~$10 - $15 / THÁNG** *(Tối ưu 93% chi phí!)* |

---

## 2. Kiến trúc Phân bổ Pod trên Cụm 3 Node (Cluster Topology)

```
[ Domain: aegisops.yourdomain.com / hubt-connect ]
                       │
                       ▼ Cloudflare (Free Proxy & DDoS Protection)
                       │
     ┌─────────────────┴─────────────────┐
     ▼                                   ▼
[ Node 1: Master (Control Plane) ]  [ Node 2: Worker 1 ]       [ Node 3: Worker 2 ]
IP: 10.0.0.10                       IP: 10.0.0.11              IP: 10.0.0.12
RAM: 2GB | Disk: 30GB SSD           RAM: 2GB | Disk: 30GB SSD  RAM: 2GB | Disk: 30GB SSD
─────────────────────────────────   ─────────────────────────  ─────────────────────────
• k3s-server (API & Core)           • scanner-worker-service   • orchestrator-service
• ingress-nginx (Cổng 80/443)       • Redis (Queue & Pub/Sub)  • knowledge-rag-service
• gateway-service                   • PostgreSQL Database      • frontend-service (Next.js)
• auth-service                      (Mounted Local-Path SSD)
```

---

## 3. Kịch bản Cài đặt Cụm K3s Tự động (Runbook 5 Phút)

### Bước 1: Khởi tạo Master Node (Node 1)
Đăng nhập SSH vào Node 1 (Ubuntu 22.04 LTS):

```bash
# Cài đặt K3s Master, vô hiệu hóa traefik mặc định để dùng Ingress-Nginx tiêu chuẩn
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik --node-ip=10.0.0.10 --bind-address=10.0.0.10" sh -

# Kiểm tra trạng thái Master Node
sudo kubectl get nodes -o wide

# Lấy Token bảo mật để các Worker Node tham gia vào cụm
sudo cat /var/lib/rancher/k3s/server/node-token
# Ví dụ xuất ra: K10abc123...::server:987654321
```

### Bước 2: Cho Worker Nodes tham gia cụm (Node 2 & Node 3)
Đăng nhập SSH vào từng Node Worker và chạy:

```bash
# Thay thế IP Master và TOKEN lấy từ Bước 1
export K3S_URL="https://10.0.0.10:6443"
export K3S_TOKEN="K10abc123...::server:987654321"

curl -sfL https://get.k3s.io | K3S_URL=${K3S_URL} K3S_TOKEN=${K3S_TOKEN} sh -
```

### Bước 3: Kiểm tra toàn bộ cụm tại Master Node
Tại Node 1, chạy lệnh kiểm tra:
```bash
sudo kubectl get nodes
```
Kết quả hiển thị 3 Nodes ở trạng thái `Ready`:
```text
NAME       STATUS   ROLES                  AGE     VERSION
node-1     Ready    control-plane,master   3m12s   v1.28.2+k3s1
node-2     Ready    <none>                 1m45s   v1.28.2+k3s1
node-3     Ready    <none>                 50s     v1.28.2+k3s1
```

---

## 4. Cài đặt Ingress-Nginx & Cert-Manager (Let's Encrypt SSL)

```bash
# 1. Cài đặt Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# 2. Cài đặt Cert-Manager tự cấp phát chứng chỉ HTTPS Let's Encrypt
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml

# 3. Tạo ClusterIssuer cho Let's Encrypt (Production)
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@gmail.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

---

## 5. Chiến lược Tiết kiệm Chi phí Token AI (LLM Budget Guard)

1. **Sử dụng Gemini 2.5 Flash / Claude 3.5 Haiku:**
   - Tốc độ suy luận đạt 150+ tokens/giây, giá thành cực thấp ($0.075 / 1 triệu input tokens).
   - Một lượt quét toàn diện của AegisOps-AI tiêu tốn trung bình ~ 4,000 tokens đầu vào + 1,200 tokens đầu ra = **~$0.001 (khoảng 25 VNĐ cho một lần quét hoàn chỉnh)**.
2. **Context Compression (Nén ngữ cảnh bằng Python trước khi đẩy vào LLM):**
   - Không ném nguyên file HTML hàng chục ngàn dòng vào Agent.
   - `scanner-worker-service` tiến hành phân tích Regex/AST cục bộ, chỉ trích xuất đúng các headers nghi vấn, danh sách disallow trong `robots.txt`, và cipher suites yếu ➔ Giảm 90% số lượng token lãng phí.
3. **Local Vector Database (ChromaDB CPU-Only):**
   - Lưu trữ WSTG Guide và CWE Database ngay trên đĩa của Node 3, embedding chạy bằng mô hình `all-MiniLM-L6-v2` hoàn toàn offline, không tốn thêm 1 xu chi phí API vector của bên thứ 3.
