
export enum Language {
  EN = 'en',
  UR = 'ur',
  ROMAN = 'roman'
}

export interface UserProfile {
  name?: string;
  cnic?: string;
  age: number;
  district: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widow';
  childrenCount: number;
  isEmployed: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  result?: SwarmResult;
}

export interface SwarmResult {
  advocate: {
    analysis: string;
    safetyScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    stats: string;
    legalRoadmap: string[];
    breachedLaws?: string[];
    validityAudit?: {
      isValid: boolean;
      reasons: string[];
      legalCitations: string[];
    };
  };
  empowermentAudit: {
    educationRightStatus: string;
    workRightStatus: string;
    remedialAction: string;
    independenceScore?: number;
    mobilityGuidance?: string;
  };
  shariaExpert: {
    context: string;
    principles: string[];
    guidance: string;
    inheritanceSpecifics?: {
      wife: string;
      daughter: string;
      shariaSource: string;
    };
  };
  healthAgent?: {
    recommendations: string[];
    priorityLevel: string;
  };
  ngoBridge: {
    recommendedNgo: {
      name: string;
      contact: string;
      reason: string;
    };
  };
  helplineExpert?: {
    immediateAdvice: string;
    emergencyNumbers: string[];
    empathyResponse: string;
  };
  draftedDocument?: {
    title: string;
    content: string;
    type: 'Supplemental Deed' | 'NADRA Application' | 'Legal Brief';
  };
}
