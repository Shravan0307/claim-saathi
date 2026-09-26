import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export type EstateCase = { name: string; date: string; employment: string; will: string; pan: string; aadhaar: string; relationship: string; heirs: string; nominee: string; contact: string; areas: string[]; demo: boolean };
export const demoCase: EstateCase = { name: 'Late Ramesh Kumar', date: '2026-08-14', employment: 'Salaried IT professional', will: 'Unknown', pan: 'Yes', aadhaar: 'Yes', relationship: 'Daughter', heirs: 'Yes', nominee: 'Some accounts', contact: '', areas: ['Bank accounts', 'Fixed deposits', 'EPF / PPF', 'Life insurance', 'Mutual funds', 'Stocks / Demat', 'Loans', 'Credit cards'], demo: true };
export const areas = ['Bank accounts', 'Fixed deposits', 'EPF / PPF', 'NPS / Pension', 'Life insurance', 'Mutual funds', 'Stocks / Demat', 'Property', 'Loans', 'Credit cards', 'Other'];
export const estateItems = [
  { name: 'Savings Account', institution: 'State Bank of India', group: 'Banking', nominee: 'Yes', value: '₹4,80,000', status: 'Not started', action: 'View checklist' },
  { name: 'Savings Account', institution: 'ICICI Bank', group: 'Banking', nominee: 'Yes', value: '₹1,25,000', status: 'In progress', action: 'Continue' },
  { name: 'Fixed Deposit', institution: 'State Bank of India', group: 'Banking', nominee: 'Unknown', value: '₹2,90,000', status: 'Documents needed', action: 'View checklist' },
  { name: 'EPF', institution: 'EPFO', group: 'Retirement', nominee: 'Unknown', value: '₹6,20,000', status: 'Documents needed', action: 'View claim guide' },
  { name: 'Term Insurance', institution: 'HDFC Life', group: 'Insurance', nominee: 'Yes', value: '₹12,00,000', status: 'In progress', action: 'Continue' },
  { name: 'Mutual Funds', institution: 'AMC / Registrar', group: 'Investments', nominee: 'No', value: '₹1,80,000', status: 'Not started', action: 'View guidance' },
  { name: 'Demat Account', institution: 'CDSL participant', group: 'Investments', nominee: 'Unknown', value: 'Unknown', status: 'Not started', action: 'View guidance' },
];
export const tasks = [
  { id: 'certificates', title: 'Obtain death certificates', period: 'DAYS 1–7', priority: 'Important', reason: 'Most institutions will ask for a certified copy before starting a claim.', docs: 'Death certificate, hospital or municipal records', institution: 'Local registrar' },
  { id: 'debits', title: 'Review active auto-debits', period: 'DAYS 1–7', priority: 'Urgent', reason: 'Recurring payments may continue from linked accounts.', docs: 'Bank statements, loan details', institution: 'Banks & lenders' },
  { id: 'home-loan', title: 'Notify Home Loan Provider', period: 'DAYS 1–7', priority: 'Urgent', reason: 'An active EMI/auto-debit may continue unless the lender is notified.', docs: 'Death certificate, loan reference, claimant ID', institution: 'Home loan lender' },
  { id: 'policies', title: 'Locate insurance policies', period: 'DAYS 1–7', priority: 'Important', reason: 'Policy numbers and nominee details help you prepare a claim.', docs: 'Policy copies, premium receipts', institution: 'Insurers' },
  { id: 'secure', title: 'Secure important documents', period: 'DAYS 1–7', priority: 'Important', reason: 'Keeping originals and copies together reduces repeat work.', docs: 'Identity, account and legal records', institution: 'Family' },
  { id: 'bank', title: 'Begin bank survivor claims', period: 'DAYS 8–30', priority: 'Next', reason: 'Each bank may have a different survivor claim process.', docs: 'Death certificate, ID, nominee or heir records', institution: 'Banks' },
  { id: 'epfo', title: 'Initiate EPFO claim', period: 'DAYS 8–30', priority: 'Next', reason: 'EPF, pension and insurance benefits may have separate forms.', docs: 'Death certificate, claimant ID, bank details', institution: 'EPFO' },
  { id: 'insurers', title: 'Notify insurers', period: 'DAYS 8–30', priority: 'Next', reason: 'Insurers can confirm the applicable claim process and documents.', docs: 'Policy number, death certificate, claimant ID', institution: 'Insurers' },
  { id: 'employer', title: 'Contact employer', period: 'DAYS 8–30', priority: 'Next', reason: 'The employer may help identify final pay and workplace benefits.', docs: 'Employee ID, death certificate', institution: 'Employer' },
  { id: 'heirs', title: 'Organize nominee/legal-heir documents', period: 'DAYS 8–30', priority: 'Next', reason: 'A missing nomination may call for additional proof.', docs: 'Nomination records, heir documents as requested', institution: 'Relevant institutions' },
  { id: 'pending', title: 'Track pending claims', period: 'DAY 30+', priority: 'Follow-up', reason: 'Record acknowledgements and follow-up dates in one place.', docs: 'Claim reference numbers', institution: 'Relevant institutions' },
  { id: 'udgam', title: 'Search unclaimed deposits', period: 'DAY 30+', priority: 'Follow-up', reason: 'Older bank deposits can be difficult to trace.', docs: 'Name, contact details and available bank clues', institution: 'RBI UDGAM' },
  { id: 'iepf', title: 'Explore IEPF discovery', period: 'DAY 30+', priority: 'Follow-up', reason: 'Older shares or dividends may have moved to IEPF.', docs: 'Name, company or folio details', institution: 'IEPF' },
  { id: 'gaps', title: 'Resolve nominee gaps', period: 'DAY 30+', priority: 'Follow-up', reason: 'Institutions may need additional documents where no nomination exists.', docs: 'Heir or succession documents as applicable', institution: 'Relevant institutions' },
];
const Glossary: Record<string,string> = {
  Nominee: 'A person named to receive or manage an asset after the account holder dies. Their role and the final entitlement can depend on the asset and applicable rules.',
  'Legal heir': 'A person who may be entitled under applicable succession law. An institution may ask for documents to confirm this.',
  'Indemnity bond': 'A document sometimes requested by an institution to address potential claims or losses. Requirements vary.',
  'Form 5IF': 'An EPFO form generally associated with an Employees’ Deposit Linked Insurance benefit. Confirm current requirements with EPFO.',
  'Survivor claim': 'A request to a bank to release an account balance after an account holder’s death, subject to its process.',
  'Unclaimed deposit': 'A bank deposit that has remained unoperated for a period specified by RBI rules. A guided portal search can help identify possible matches.',
};
export function meaning(term: string) { return Glossary[term] ?? ''; }

export type DemoUser = { name: string; email: string };
type CaseContext = { estate: EstateCase | null; setEstate: (value: EstateCase | null) => void; completed: string[]; toggleTask: (id:string) => void; uploaded: string[]; addUpload: (name:string) => void; loadDemo: () => void; user: DemoUser | null; signIn: (user: DemoUser) => void; signOut: () => void };
const Context = createContext<CaseContext | null>(null);
export function CaseProvider({children}: {children:ReactNode}) {
  const [estate, setEstateState] = useState<EstateCase | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [user, setUser] = useState<DemoUser | null>(null);
  useEffect(() => { try { const saved = sessionStorage.getItem('claim-saathi-case'); if(saved) setEstateState(JSON.parse(saved)); const done = sessionStorage.getItem('claim-saathi-tasks'); if(done) setCompleted(JSON.parse(done)); const docs = sessionStorage.getItem('claim-saathi-docs'); if(docs) setUploaded(JSON.parse(docs)); const u = sessionStorage.getItem('claim-saathi-user'); if(u) setUser(JSON.parse(u)); } catch { /* ignore invalid demo data */ } }, []);
  const setEstate = (value: EstateCase | null) => { setEstateState(value); if(value) sessionStorage.setItem('claim-saathi-case', JSON.stringify(value)); else sessionStorage.removeItem('claim-saathi-case'); };
  const toggleTask = (id:string) => { const next = completed.includes(id) ? completed.filter(x=>x!==id) : [...completed,id]; setCompleted(next); sessionStorage.setItem('claim-saathi-tasks',JSON.stringify(next)); toast.success(completed.includes(id) ? 'Task reopened' : 'Task marked complete'); };
  const addUpload = (name:string) => { const next = [...new Set([...uploaded,name])]; setUploaded(next); sessionStorage.setItem('claim-saathi-docs',JSON.stringify(next)); toast.success('Document added to this demo case'); };
  const loadDemo = () => { setEstate(demoCase); setCompleted(['certificates','policies','secure','employer','heirs','bank','insurers','pending']); sessionStorage.setItem('claim-saathi-tasks',JSON.stringify(['certificates','policies','secure','employer','heirs','bank','insurers','pending'])); setUploaded(['Death Certificate','PAN Card','Bank Passbook','Insurance Policy']); sessionStorage.setItem('claim-saathi-docs',JSON.stringify(['Death Certificate','PAN Card','Bank Passbook','Insurance Policy'])); toast.success('Fictional demo case loaded'); };
  const signIn = (value: DemoUser) => { setUser(value); sessionStorage.setItem('claim-saathi-user', JSON.stringify(value)); };
  const signOut = () => { setUser(null); sessionStorage.removeItem('claim-saathi-user'); toast.success('Signed out of this demo session'); };
  return <Context.Provider value={{estate,setEstate,completed,toggleTask,uploaded,addUpload,loadDemo,user,signIn,signOut}}>{children}</Context.Provider>;
}
export function useCase() { const ctx = useContext(Context); if(!ctx) throw new Error('CaseProvider missing'); return ctx; }
