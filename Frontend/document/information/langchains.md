# LangChain 정리 (깔끔하게)

## 1. OpenAI 함수
- 모델 불러오기: 
  ```python
  from langchain_openai import OpenAI
  model = OpenAI(model_name="모델 이름", temperature=0)
  ```
- 인퍼런스:
  ```python
  result = model.invoke("입력 텍스트")
  ```

## 2. 메시지(Message) 구조
- **SystemMessage**: AI의 행동/성격/규칙/맥락 지정
- **HumanMessage**: 사용자의 입력
- **AIMessage**: AI의 답변
- **멀티턴 대화 예시**:
  ```python
  from langchain.schema import SystemMessage, HumanMessage, AIMessage
  messages = [
      SystemMessage(content="너는 요리 전문가야."),
      HumanMessage(content="카레 레시피 알려줘."),
      AIMessage(content="카레 레시피는 ...")
  ]
  result = model.invoke(messages)
  ```

## 3. 프롬프트(Prompt)
- **PromptTemplate**: 변수와 함께 프롬프트 생성
  ```python
  from langchain.prompts import PromptTemplate
  template = """다음 요리의 레시피를 생각해 주세요.\n요리: {dish}"""
  prompt = PromptTemplate(input_variables=["dish"], template=template)
  formatted = prompt.format(dish="카레")
  ```

## 4. OutputParser
- **PydanticOutputParser**: LLM 출력 → Pydantic 모델로 파싱
  - Pydantic 모델 정의:
    ```python
    from pydantic import BaseModel, Field
    class Recipe(BaseModel):
        ingredients: list[str] = Field(description="재료")
        steps: list[str] = Field(description="조리 순서")
    ```
  - 파서 생성 및 사용:
    ```python
    from langchain.output_parsers import PydanticOutputParser
    parser = PydanticOutputParser(pydantic_object=Recipe)
    format_instructions = parser.get_format_instructions()
    ouput = model.invoke(format_instructions)
    # 프롬프트에 format_instructions 포함
    # LLM 출력 후
    recipe = parser.parse(output.content)
    ```
- **출력 형식 오류 시**:
  - OutputFixingParser, RetryWithErrorOutputParser로 자동 재요청/수정

## 5. 체인(Chains)
- **LLMChain**: 여러 모듈(프롬프트, LLM, 파서 등) 결합
  ```python
  from langchain.chains import LLMChain
  chain = LLMChain(prompt=prompt, llm=model, output_parser=parser)
  result = chain.invoke("카레")
  ```
- **SimpleSequentialChain**: 여러 체인을 순차적으로 실행
  ```python
  from langchain.chains import SimpleSequentialChain
  chain = SimpleSequentialChain([chain1, chain2])
  result = chain.invoke("입력값")
  ```
- **LLMRouterChains**: 라우팅 체인(고급)

---

### 기타
- OutputParser: LLM 출력이 JSON 등 구조화된 데이터가 아닐 때 자동으로 재요청/수정 가능
- 다양한 체인(Chains) 조합으로 복잡한 워크플로우 구현 가능

![다른 chains](../images/image.png) 

## 6. Chain 내부 동작(Verbose/Debug) 확인
- 체인의 내부 동작(프롬프트, 중간 결과 등)을 확인하고 싶을 때 아래 설정을 코드 상단에 추가

```python
import langchain

langchain.verbose = True  # 포맷된 프롬프트 등 주요 정보 출력
langchain.debug = True    # 체인 내부 동작을 가장 상세하게 출력
```
- `verbose`는 프롬프트 등 주요 정보, `debug`는 더 상세한 내부 동작까지 모두 출력
- 디버깅 및 체인 동작 이해에 매우 유용

### 참고: LangSmith
- LangSmith(2023년 7월 발표)는 LangChain 기반 애플리케이션의 디버깅을 돕는 도구

## 7. Memory (기본 방식)
- LangChain에서 대화 기록 등 상태를 저장하려면 ConversationBufferMemory 등 메모리 모듈을 사용
- 기본적으로 ConversationChain과 함께 사용

```python
from langchain.chains.conversation.base import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI

chat = ChatOpenAI(model="gpt-4.1-nano-2025-04-14", temperature=0)
conversation = ConversationChain(
    llm=chat,
    memory=ConversationBufferMemory()
)

while True:
    user_message = input("You: ")
    if user_message == "끝":
        print("(대화 종료)")
        break
    ai_message = conversation.invoke(input=user_message)["response"]
    print(f"AI: {ai_message}")
```

- ConversationChain은 LLM과 메모리 객체를 결합해 대화형 AI를 쉽게 구현할 수 있음
- ConversationBufferMemory는 대화 기록을 메모리에 저장함

### 주요 Memory 클래스 종류 및 개요

| 클래스명                        | 개요                                                         |
|-------------------------------|------------------------------------------------------------|
| ConversationBufferWindowMemory | 최근 K개의 대화만 프롬프트에 포함한다                        |
| ConversationSummaryMemory      | LLM을 사용하여 대화 기록을 요약한다                          |
| ConversationSummaryBufferMemory| 최근 대화는 프롬프트에 그대로 포함, 이전 대화는 요약          |
| ConversationTokenBufferMemory  | 지정한 토큰 개수만큼의 대화만 프롬프트에 포함한다             |
| VectorStoreRetrieverMemory     | Vector store를 활용해 관련된 K개의 텍스트만 기억으로 포함      |

- 각 Memory 클래스는 대화 기록을 관리하는 방식이 다르며, 상황에 맞게 선택하여 사용할 수 있음
- 자세한 구조와 동작 방식은 공식 문서 및 아래 이미지 참고

![Memory 종류 예시1](../images/memory_exmaple.png)
![Memory 종류 예시2](../images/memory_exmaple2.png)
