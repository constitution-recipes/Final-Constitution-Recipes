'use client';

/**
 * 사용자 모델 클래스
 * Flutter 기존 프로젝트의 UserModel 클래스를 JavaScript로 재구현
 */
export class UserModel {
  constructor({
    id = null,
    email,
    name = null,
    phoneNumber = null,
    allergies = null,
    healthGoals = null,
    currentHealthStatus = null,
    existingConditions = null,
    constitution = null,
    constitutionReason = null,
    constitutionConfidence = null,
    createdAt = new Date(),
  } = {}) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.allergies = allergies;
    this.healthGoals = healthGoals;
    this.currentHealthStatus = currentHealthStatus;
    this.existingConditions = existingConditions;
    this.constitution = constitution;
    this.constitutionReason = constitutionReason;
    this.constitutionConfidence = constitutionConfidence;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  /**
   * JSON 객체로 변환
   * @returns {Object} 사용자 정보를 담은 JSON 객체
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      phoneNumber: this.phoneNumber,
      allergies: this.allergies,
      healthGoals: this.healthGoals,
      currentHealthStatus: this.currentHealthStatus,
      existingConditions: this.existingConditions,
      constitution: this.constitution,
      constitutionReason: this.constitutionReason,
      constitutionConfidence: this.constitutionConfidence,
      createdAt: this.createdAt.toISOString(),
    };
  }

  /**
   * JSON 객체로부터 UserModel 인스턴스 생성
   * @param {Object} json - 사용자 정보를 담은 JSON 객체
   * @returns {UserModel} 생성된 UserModel 인스턴스
   */
  static fromJSON(json) {
    return new UserModel({
      id: json.id,
      email: json.email,
      name: json.name,
      phoneNumber: json.phoneNumber || json.phone_number || null,
      allergies: json.allergies || [],
      healthGoals: json.healthGoals || json.health_goals || [],
      currentHealthStatus: json.currentHealthStatus || json.healthStatus || json.health_status || "",
      existingConditions: json.existingConditions || json.illnesses || "",
      constitution: json.constitution,
      constitutionReason: json.constitutionReason || json.constitution_reason || "",
      constitutionConfidence: json.constitutionConfidence || json.constitution_confidence || null,
      createdAt: json.createdAt,
    });
  }
} 