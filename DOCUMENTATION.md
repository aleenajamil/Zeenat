# Zeenat-AI: Technical & Functional Documentation

Zeenat-AI is a multi-agent empowerment system specifically designed for Pakistani women. It serves as a "Digital Guardian," providing localized legal, religious, and social guidance through an AI-powered expert swarm.

---

## 1. Core Mission
To bridge the gap between complex legal documents (like the Nikkah Nama) and a woman's awareness of her rights. The app converts static legal language into actionable, understandable, and culturally resonant insights.

---

## 2. Key Features

### 🌍 Bilingual Interface (English & Urdu)
- **Urdu Nastaliq Support**: Uses "Noto Nastaliq Urdu" for a professional and traditional aesthetic.
- **Dynamic Language Toggle**: Seamlessly switches the entire UI, including AI responses, between English and Urdu.

### 📜 Interactive Nikkah Nama Explorer
- **Visual Mapping**: An interactive tool that maps out the 25 columns of the Pakistani Marriage Contract (Nikkah Nama).
- **Column Auditing**: Users can click specific columns (e.g., Column 17 for Education/Work rights, Column 18 for Delegation of Divorce) to receive immediate legal explanations.
- **Critical Focus**: Specifically monitors Column 17 (Right to Work/Education) to ensure women understand their right to pursue a career post-marriage.
- **Validity Audit**: Checks specifically for Nikkah validity (age, registration, consent) and interprets mobility rights (Article 15).

### 🐝 AI Expert Swarm (The "Guardian Engine")
When a user submits a query (via text or voice), the system triggers a multi-agent analysis:
1. **The Advocate**: Evaluates the situation under Pakistani Civil Law (e.g., Family Courts Act 1964) and identifies specific **Legal Breaches** (e.g., Section 498A PPC).
2. **The Sharia Expert**: Provides context from Islamic jurisprudence, including specific **Inheritance Breakdown** (Wives and Daughters shares) and modern interpretations of Mahram/Travel rules.
3. **The Empowerment Auditor**: Analyzes situation through rights lens, calculate an **Independence Score** (0-100%) and provides mobility guidance.
4. **The NGO Bridge**: Recommends featured featured partners (NGOs/Lawyers) for direct callback and support.
5. **The Case Preparer**: Synthesizes a roadmap and next steps.

### 💰 Sustaining the Mission (Monetization)
- **Verified Registry**: Featured profiles for Family Lawyers and Human Rights professionals.
- **NGO Partnerships**: Priority referral bridges for organizations like the Legal Aid Society.
- **Educational Ads**: Context-aware sponsorship for legal workshops and workshops for women.

### 🆔 Digital Profile & Metrics
- **Safety Score**: Measures physical and legal security. High risk triggers SOS protocols.
- **Independence Score**: Measures agency over life choices (Work/Education/Divorce rights).
- **Breach Detection**: Highlights specific Pakistani laws being violated in the user's scenario.

---

## 3. Application Workflow

1. **Landing**: Introduces the "Digital Guardian" concept.
2. **Profile Creation**: Collects demographic context (Non-PII) to localize the engine.
3. **Guardian Mode**:
   - **Manual Inquiry**: Type or speak a question.
   - **Document Audit**: Scan/Select columns on a virtual Nikkah Nama.
4. **Analysis View**: Displays the Swarm's findings, risk levels, and a "Legal Roadmap."
5. **Action Center**: Provides drafted documents and NGO contact cards for immediate next steps.

---

## 4. Technical Architecture

### Frontend
- **React 19 & Vite**: For high-performance, modern UI rendering.
- **Tailwind CSS**: Custom color palette (Deep Emerald & Muted Gold) for a polished, cultural feel.
- **Framer Motion**: (Implied/Used) for smooth transitions between "Landing" and "Guardian" modes.
- **FontAwesome/Lucide**: For intuitive iconography.

### Backend & AI
- **Google Gemini API**: Powers the complex multi-perspective analysis using `gemini-3-flash-preview`.
- **Structured JSON Output**: The AI is strictly constrained to return JSON, ensuring the UI can reliably display expert charts and roadmaps.

### Services
- `geminiService.ts`: Manages the prompt engineering for the expert swarm, including profile injection and language constraints.

---

## 5. Security & Privacy
- **Stateless Analysis**: The app primarily functions as an on-demand audit tool.
- **Anonymized Input**: Users are encouraged to describe situations without necessarily sharing private identification.
- **Legal Disclaimer**: Clearly states that the tool is an AI guardian and not a replacement for a licensed attorney.

---

## 6. NGO Database (Built-in)
The app includes a verified catalog of Pakistani support systems:
- **Bedari Helpline**: General support.
- **Aurat Foundation**: Legal aid experts.
- **Legal Aid Society**: Protection and advocacy.
- **1094 Helpline**: Emergency shelter and government support.
