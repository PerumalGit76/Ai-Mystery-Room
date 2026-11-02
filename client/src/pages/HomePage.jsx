import { ArrowDown, ArrowRight, Camera, FileText, Fingerprint, MessageSquareText, ScanLine, Shield, Sparkles } from 'lucide-react';
import { Button, Brand, Eyebrow, FictionNote } from '../components/common.jsx';

const clues = [
  { icon: MessageSquareText, label: 'PRIVATE MESSAGES', time: '22:14', type: 'chat' },
  { icon: Camera, label: 'CAMERA LOG 03', time: '22:08:41', type: 'camera' },
  { icon: FileText, label: 'WITNESS STATEMENT', time: '22:32', type: 'paper' },
];

export default function HomePage() {
  return <div className="home-page">
    <header className="topbar"><div className="topbar-inner"><Brand/><nav className="home-nav"><a href="#method">The method</a><a href="#evidence">Evidence</a></nav><Button to="/create" variant="outline" className="nav-cta">Open a case <ArrowRight size={15}/></Button></div></header>
    <main>
      <section className="hero shell">
        <div className="hero-copy"><Eyebrow>A DETECTIVE EXPERIENCE</Eyebrow><h1>Every detail<br/>holds a <em>secret.</em></h1><p className="hero-lede">A room full of stories. One version of the truth. Follow the evidence and find what everyone else missed.</p><div className="hero-actions"><Button to="/create">Create your mystery <ArrowRight size={16}/></Button><a href="#method" className="text-link">How it works <ArrowDown size={14}/></a></div><div className="hero-proof"><span className="proof-icon"><Fingerprint size={17}/></span><span>Built from your story.<br/><b>Solved by you.</b></span></div></div>
        <div className="hero-art" aria-label="Illustration of an investigation board">
          <div className="art-grain"/><div className="board-stamp">CASE FILE <b>NO. 014</b></div><div className="board-line line-a"/><div className="board-line line-b"/><div className="board-line line-c"/>
          <div className="portrait-card"><div className="portrait-head"/><div className="portrait-body"/><span>SUBJECT 03</span></div>
          <div className="note-card note-one"><small>FIELD NOTE / 22:14</small><p>“I never left the east hall.”</p><span className="red-pencil">— except the camera says otherwise</span></div>
          <div className="photo-card"><div className="window-shape"/><div className="shadow-shape"/><span>STILL 08:41 PM</span></div><div className="pin pin-a"/><div className="pin pin-b"/><div className="board-index"><span>01</span><span>02</span><span className="selected">03</span><span>04</span></div><div className="case-tag">THE GLASS<br/>ORCHID <span>✳</span></div>
        </div>
      </section>
      <section className="ticker" aria-label="Case principles"><div className="ticker-track"><span>OBSERVE</span><i>✳</i><span>CONNECT</span><i>✳</i><span>QUESTION</span><i>✳</i><span>OBSERVE</span><i>✳</i><span>CONNECT</span><i>✳</i><span>QUESTION</span><i>✳</i></div></section>
      <section id="method" className="method-section shell"><div className="section-heading"><div><Eyebrow>THE METHOD</Eyebrow><h2>Make a case.<br/><em>Find the truth.</em></h2></div><p>Every investigation begins with a story and ends with your call. The answer is already there. You just have to see it.</p></div><div className="method-grid"><article><span className="step-no">01</span><Sparkles/><h3>Set the scene</h3><p>Give us a premise. A vanished heirloom, a locked room, a dinner gone wrong.</p></article><article><span className="step-no">02</span><ScanLine/><h3>Read the room</h3><p>Inspect interviews, messages, timelines and camera logs. Every piece connects.</p></article><article><span className="step-no">03</span><Fingerprint/><h3>Make your call</h3><p>Choose your suspect. Then see how your theory holds up against the facts.</p></article></div></section>
      <section id="evidence" className="evidence-band"><div className="shell evidence-layout"><div><Eyebrow>THE CASE IS YOURS</Eyebrow><h2>Stories hide in<br/>the <em>small things.</em></h2><p>A timestamp out of place. A detail that changes. An alibi with one loose thread.</p><Button to="/create" variant="light">Start investigating <ArrowRight size={16}/></Button></div><div className="evidence-stack">{clues.map(({icon:Icon,label,time,type},i)=><div className={`clue-slip slip-${type}`} key={label}><div className="slip-icon"><Icon size={17}/></div><div><small>{label}</small><strong>{type==='chat'?'“Still in the gallery?”':type==='camera'?'MOTION DETECTED':'Witness: Mara Vale'}</strong></div><time>{time}</time><span className="slip-number">0{i+1}</span></div>)}</div></div></section>
      <section className="closing shell"><div><Eyebrow>YOUR MOVE</Eyebrow><h2>What really<br/>happened?</h2></div><Button to="/create">Build your case <ArrowRight size={16}/></Button><div className="closing-seal"><Shield size={20}/><span>FICTIONAL<br/>BY DESIGN</span></div></section>
    </main>
    <footer className="footer"><div className="shell footer-inner"><Brand/><span>Fictional investigations for curious minds.</span><FictionNote/></div></footer>
  </div>;
}
