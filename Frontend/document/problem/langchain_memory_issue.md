# LangChain 기반 챗봇 대화 맥락(메모리) 관리 문제 해결 경험

## 문제 상황

프로젝트에서 LangChain(JS/TS) 기반 챗봇을 개발할 때, 다음과 같은 문제가 발생했습니다.

- **대화 맥락(히스토리)이 올바르게 유지되지 않음**
- role(user/assistant) 구분이 꼬이거나, 이전 대화 내용이 누락됨
- 여러 사용자/세션별로 대화 기록이 분리되지 않음
- context window 한계로 인해 오래된 메시지가 잘려나가거나, 모델이 맥락을 잊어버림

이로 인해 챗봇이 사용자의 이전 질문/답변을 기억하지 못하거나, 대화 흐름이 어색해지는 문제가 있었습니다.

---

## 원인 분석

1. **messages 배열 직접 관리의 한계**
   - 대화 메시지를 직접 배열로 관리할 때, role(user/assistant) 구분 실수, 메시지 누락, 세션 분리 미흡 등 실수가 잦음
2. **자동화된 메모리 관리 미적용**
   - LangChain이 제공하는 RunnableWithMessageHistory, LangGraph의 checkpointer 등 자동화 기능을 활용하지 않으면, 대화 맥락이 쉽게 꼬임
3. **context window 한계 미고려**
   - LLM의 context window를 초과할 경우, 오래된 메시지가 잘려나가 중요한 정보가 손실됨
4. **여러 사용자/세션 분리 미흡**
   - sessionId, thread_id 등으로 히스토리를 분리하지 않으면, 사용자별 대화가 섞임

---

## 해결 방법

### 1. LangChain의 자동 히스토리 관리 기능 적극 활용
- `RunnableWithMessageHistory`를 사용해, 각 세션별로 대화 히스토리를 자동 저장/불러오기
- 메시지 객체(HumanMessage, AIMessage 등)로 role을 자동 관리

```js
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "당신은 친절한 어시스턴트입니다."],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);
const chain = prompt.pipe(llm);

const demoEphemeralChatMessageHistory = new ChatMessageHistory();
const chainWithMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (_sessionId) => demoEphemeralChatMessageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

// 대화 시작
await chainWithMessageHistory.invoke(
  { input: "안녕!" },
  { configurable: { sessionId: "user1" } }
);
```

### 2. LangGraph의 checkpointer로 세션별 대화 맥락 영구 저장
- `MemorySaver`, `SqliteSaver` 등으로 thread_id별 대화 상태를 자동 저장/복원

```js
import {
  START, END, MessagesAnnotation, StateGraph, MemorySaver,
} from "@langchain/langgraph";

const callModel = async (state) => {
  const systemPrompt = "당신은 친절한 어시스턴트입니다.";
  const messages = [
    { role: "system", content: systemPrompt },
    ...state.messages,
  ];
  const response = await llm.invoke(messages);
  return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

// thread_id별로 대화 맥락 유지
await app.invoke(
  { messages: [{ role: "user", content: "안녕!" }] },
  { configurable: { thread_id: "user1" } }
);
```

### 3. context window 한계 대응: trimming/요약
- 오래된 메시지는 잘라내거나 요약해서 context window 초과 방지
- LangChain의 `trimMessages` 유틸 활용

```js
import { trimMessages } from "@langchain/core/messages";
const trimmer = trimMessages({
  strategy: "last",
  maxTokens: 2,
  tokenCounter: (msgs) => msgs.length,
});
// callModel 함수 내에서
const trimmedMessages = await trimmer.invoke(state.messages);
```

---

## 실제 적용 결과 및 어필 포인트

- **대화 맥락이 세션별로 정확히 분리되고, role(user/assistant)도 자동 관리되어 버그가 사라짐**
- context window 한계로 인한 정보 손실도 trimming/요약으로 해결
- LangChain/LangGraph의 공식 기능을 적극 활용하여, 유지보수성과 확장성이 크게 향상됨
- 여러 사용자/세션 동시 지원, 장기 대화에도 안정적으로 맥락 유지

> **이 경험을 통해, LLM 기반 챗봇의 대화 메모리 관리 문제를 체계적으로 분석하고, LangChain의 최신 기능을 활용해 실질적인 문제 해결 능력을 갖추었음을 어필할 수 있습니다.** 