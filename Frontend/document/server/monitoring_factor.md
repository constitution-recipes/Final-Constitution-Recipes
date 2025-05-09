아래는 `chatbot_recipe_feature.md`, `README.md`, `architecture_overview.md`를 참고하여 서비스 운영 단계에서 Prometheus + Grafana로 모니터링해야 할 주요 지표들을 정리한 내용입니다. 각 카테고리별로 메트릭 이름 예시와 설명, 대시보드 구성 제안을 포함했습니다.

---

## 1. 인프라(서버/컨테이너) 레벨
1. CPU / 메모리 / 디스크 / 네트워크  
   - `node_cpu_seconds_total{mode!="idle"}`: CPU 사용률  
   - `node_memory_MemAvailable_bytes` / `node_memory_MemTotal_bytes`: 가용 메모리 비율  
   - `node_disk_io_time_seconds_total`: 디스크 I/O 대기 시간  
   - `node_network_receive_bytes_total` / `node_network_transmit_bytes_total`: 네트워크 트래픽  
2. 컨테이너 상태 (쿠버네티스)  
   - `container_cpu_usage_seconds_total`  
   - `kube_pod_container_status_restarts_total`  
3. 디스크 공간  
   - `node_filesystem_avail_bytes` / `node_filesystem_size_bytes`

**대시보드 섹션**: Cluster Overview, Host Metrics

---

## 2. 애플리케이션/서비스 레벨
1. HTTP API  
   - `http_server_requests_total{handler,method,code}`: 총 요청 수(분류: 2xx/4xx/5xx)  
   - `http_server_request_duration_seconds_bucket{handler}`: 응답 시간 분포(p50, p90, p99)  
   - `http_server_in_flight_requests`: 동시 처리 중인 요청 수  
2. 에러 비율 & 알림  
   - `rate(http_server_requests_total{code=~"5.."}[1m]) / rate(http_server_requests_total[1m])`: 5xx 에러 비율  
   - Alert: 5xx 비율 > 1% for 5분 → Slack/이메일 알림  

**대시보드 섹션**: API Performance, Error Rate

---

## 3. 챗봇 & LLM(RAG) 파이프라인
1. RAG 검색(벡터 DB)  
   - `rag_retrieval_duration_seconds`: 검색 지연 시간  
   - `vector_db_query_total`: 초당 쿼리 수(QPS)  
2. LLM 호출  
   - `llm_request_duration_seconds`: LLM 응답 시간 (p50/p90/p99)  
   - `llm_request_tokens_total`: 사용 토큰 수 합계  
   - `llm_request_errors_total`: LLM 호출 실패 수  
   - `llm_fallback_count`: 대체 모델(Agent) 트리거 횟수  
3. 세션 관리  
   - `chat_sessions_started_total`: 대화 세션 시작 건수  
   - `chat_sessions_active_current`: 활성 대화 세션 수  
   - `chat_sessions_duration_seconds`: 세션당 평균 대화 지속 시간  

**대시보드 섹션**: Chatbot Pipeline, LLM Health

### 3.1. 모델 성능 평가 지표
1. Inference Latency
   - `model_inference_duration_seconds_bucket{model="gpt-3.5"}`: RAG/LLM 호출 응답 시간 히스토그램(p50/p90/p99)
   - `model_inference_duration_seconds_sum` / `model_inference_duration_seconds_count`: 평균 응답 시간
2. Throughput
   - `model_inference_requests_total{model="gpt-3.5"}`: 초당 처리된 요청 수(RPS)
   - `model_inference_in_flight_requests`: 현재 병렬 처리 중인 인퍼런스 수
3. 토큰 사용량
   - `model_request_input_tokens_total{model="gpt-3.5"}`: 입력 토큰 사용량 합계
   - `model_request_output_tokens_total{model="gpt-3.5"}`: 출력 토큰 사용량 합계
4. 실패율 및 재시도
   - `model_request_errors_total{model="gpt-3.5"}`: 모델 호출 실패 수
   - `model_request_retries_total`: 재시도 횟수
5. 품질 지표
   - `model_perplexity_average{model="gpt-3.5"}`: 평균 퍼플렉시티
   - `model_confidence_score_histogram{model="gpt-3.5"}`: Confidence 분포
6. 사용자 피드백
   - `model_user_feedback_score_sum` / `model_user_feedback_score_count`: 평균 유저 평점(1~5)
   - `model_user_feedback_count_total`: 피드백 제출 건수

---

## 4. 큐/비동기 작업 (RabbitMQ & Celery)(추후)
1. 메시지 큐 상태  
   - `rabbitmq_queue_messages_ready`: 대기 중인 메시지 수  
   - `rabbitmq_queue_messages_unacknowledged`: 처리 중인 메시지 수  
2. 작업 처리량  
   - `celery_task_received_total`  
   - `celery_task_succeeded_total`  
   - `celery_task_failed_total`  
3. 지연(backlog)  
   - `celery_worker_active_tasks`: 워커 당 활성 태스크 수  

**대시보드 섹션**: Queue Overview, Worker Health

---

## 5. 데이터베이스 & 캐시(추후)
1. MongoDB  
   - `mongodb_commands_total{command="find"}`: find 요청 횟수  
   - `mongodb_op_latency_seconds_bucket`: DB 연산 지연 시간 분포  
2. Redis  
   - `redis_commands_processed_total`  
   - `redis_keyspace_hits_total` / `redis_keyspace_misses_total`: 캐시 히트/미스 비율  
3. 연결 수  
   - `mongodb_connections_current`  
   - `redis_connected_clients`

**대시보드 섹션**: DB Performance, Cache Efficiency

---

## 6. 비즈니스 & UX 지표
1. 레시피 생성/추천  
   - `recipes_generated_total`: 생성된 레시피 수  
   - `recipes_generation_duration_seconds_bucket`: 생성 지연 시간(p50/p90/p99)  
   - `recipes_generation_errors_total`: 생성 실패 수  
2. 기능별 사용량  
   - `feature_fridge_cleaner_used_total`  
   - `feature_recipe_tweaker_used_total`  
   - `feature_budget_cooker_used_total` 등  
3. 사용자 활동  
   - `users_active_daily` (DAU) / `users_active_monthly` (MAU)  
   - `chatbot_conversion_rate`: 챗봇 세션→레시피 생성 전환율  
   - `session_dropoff_rate`: 각 챗봇 단계별 이탈률  

**대시보드 섹션**: Business KPIs, Feature Adoption

---

## 7. 알림(Alert) 전략
- CPU 사용률 > 80% (5분)  
- 메모리 가용량 < 15%  
- http 5xx 비율 > 1%  
- LLM 평균 응답 시간(p90) > 1초  
<!-- - RabbitMQ 대기 메시지 수 > 50건  
- MongoDB 평균 쿼리 지연(p95) > 200ms   -->

---

## 8. Grafana 대시보드 구성 제안
1. **Overview**: 인프라 + 애플리케이션 전반 상태  
2. **API & Latency**: 요청량, 응답 시간, 에러  
3. **Chatbot & LLM**: RAG 검색, LLM 호출, 세션  
4. **Queue & Workers**: RabbitMQ, Celery  
5. **DB & Cache**: MongoDB, Redis  
6. **Business Metrics**: DAU/MAU, 레시피 생성, 기능 사용량  

---

위 지표를 바탕으로 Prometheus에 메트릭을 계측하고, Grafana에서 위 6개 대시보드를 구성하면 서비스 안정성, 성능, 비즈니스 성과를 종합적으로 모니터링할 수 있습니다.
