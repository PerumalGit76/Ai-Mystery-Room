import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Fingerprint, LoaderCircle, ShieldCheck } from 'lucide-react';

export function Brand({ compact = false }) {
  return <Link className="brand" to="/" aria-label="AI Mystery Room home"><span className="brand-mark"><Fingerprint size={21} /></span>{!compact && <span>THE MYSTERY ROOM</span>}</Link>;
}
export function Topbar({ back, right }) {
  return <header className="topbar"><div className="topbar-inner">{back ? <Link to={back} className="back-link"><ArrowLeft size={16} /> Back</Link> : <Brand />}{right || <span className="topbar-note"><span className="live-dot" /> FICTIONAL CASE FILES</span>}</div></header>;
}
export function Button({ children, to, onClick, variant = 'primary', disabled, type = 'button', className = '' }) {
  const cls = `button button-${variant} ${className}`;
  return to ? <Link to={to} className={cls}>{children}</Link> : <button type={type} className={cls} onClick={onClick} disabled={disabled}>{children}</button>;
}
export function Loading({ label = 'Opening the case file…' }) {
  return <div className="loading-state"><LoaderCircle className="spin" size={25} /><span>{label}</span></div>;
}
export function ErrorNotice({ children, onRetry }) {
  return <div className="error-notice" role="alert"><span>{children}</span>{onRetry && <button onClick={onRetry}>Try again <ArrowRight size={14}/></button>}</div>;
}
export function FictionNote({ children = 'All case material is fictional and created for entertainment.' }) {
  return <div className="fiction-note"><ShieldCheck size={15}/><span>{children}</span></div>;
}
export function Eyebrow({ children }) { return <div className="eyebrow"><span />{children}</div>; }
