# schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


def to_camel(string: str) -> str:
    parts = string.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: str = Field(..., alias='phoneNumber')
    allergies: Optional[List[str]] = Field(None, alias='allergies')
    health_status: Optional[str] = Field(None, alias='healthStatus')
    health_goals: Optional[List[str]] = Field(None, alias='healthGoals')
    illnesses: Optional[str] = Field(None, alias='existingConditions')

    class Config:
        allow_population_by_field_name = True


class UserProfileUpdate(BaseModel):
    allergies: List[str]
    health_status: str = Field(..., alias='currentHealthStatus')
    health_goals: Optional[List[str]] = None
    illnesses: Optional[str] = Field(None, alias='existingConditions')

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone_number: Optional[str] = Field(None, alias='phoneNumber')
    allergies: Optional[List[str]]
    health_status: Optional[str] = Field(None, alias='healthStatus')
    health_goals: Optional[List[str]] = Field(None, alias='healthGoals')
    illnesses: Optional[str] = None
    constitution: Optional[str] = None
    constitution_reason: Optional[str] = None
    constitution_confidence: Optional[float] = None

    class Config:
        orm_mode = True
        alias_generator = to_camel
        allow_population_by_field_name = True

    @classmethod
    def from_mongo(cls, document: dict):
        document = cls._preprocess_document(document)
        return cls(**document)

    @staticmethod
    def _preprocess_document(document: dict) -> dict:
        doc = document.copy()
        # _id → id 변환
        doc["id"] = str(doc.get("_id", ""))
        doc.pop("_id", None)

        # snake_case → camelCase 변환
        if "phone_number" in doc:
            doc["phoneNumber"] = doc["phone_number"]
        if "health_status" in doc:
            doc["healthStatus"] = doc["health_status"]
        if "health_goals" in doc:
            doc["healthGoals"] = doc["health_goals"]
        if "illnesses" in doc:
            doc["existingConditions"] = doc["illnesses"]

        # 누락된 필드 기본값 보정
        doc.setdefault("phoneNumber", None)
        doc.setdefault("allergies", None)
        doc.setdefault("healthStatus", None)
        doc.setdefault("healthGoals", None)
        doc.setdefault("existingConditions", None)
        doc.setdefault("constitution", None)
        doc.setdefault("constitutionReason", None)
        doc.setdefault("constitutionConfidence", None)

        return doc


class SignupResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: str
