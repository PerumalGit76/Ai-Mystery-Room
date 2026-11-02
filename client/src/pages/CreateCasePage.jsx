import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, LoaderCircle, Sparkles } from 'lucide-react';
import { createCase } from '../services/api.js';
import { Button, Eyebrow, FictionNote, Topbar } from '../components/common.jsx';

const levels = [
  { id: 'EASY', name: 'Easy', detail: 'Clear clues. A steady trail.' },
  { id: 'MEDIUM', name: 'Medium', detail: 'Connected clues. A few diversions.' },
  { id: 'HARD', name: 'Hard', detail: 'Subtle details. Interwoven alibis.' },
];

export default function CreateCasePage() {
  const [story, setStory] = useState(''); const [difficulty, setDifficulty] = useState('MEDIUM');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (story.trim().length < 30) { setError('Give your premise at least 30 characters so we have enough to build on.'); return; }
    if (story.length > 2000) { setError('Keep your premise under 2,000 characters.'); return; }
    setLoading(true);
    try { const { data } = await createCase(story.trim(), difficulty); navigate(`/case/${data.caseId}`, { replace: true }); }
    catch (err) { setError(err.message); setLoading(false); }
  };
  return <div className="create-page"><Topbar back="/"/><main className="create-shell">
    <div className="create-intro"><Eyebrow>BEGIN AN INVESTIGATION</Eyebrow><h1>Start with a<br/><em>what if.</em></h1><p>A single premise is all it takes. We’ll build the suspects, the evidence, and a mystery with one answer.</p><div className="create-annotation"><BookOpen size={18}/><span>You don’t need to know the culprit.<br/><b>That part is yours to discover.</b></span></div></div>
    <form className="creation-form" onSubmit={submit}>
      <div className="form-heading"><span>01 / THE PREMISE</span><span>REQUIRED</span></div>
      <label htmlFor="storyPrompt">What happened?</label><p className="field-hint">Describe the scene, the missing thing, or the moment everything changed.</p>
      <textarea id="storyPrompt" value={story} onChange={(e)=>setStory(e.target.value)} maxLength={2000} placeholder="A storm traps six guests inside a country hotel. By morning, the host has vanished and every clock has stopped at 11:17…" aria-describedby="story-count story-error" />
      <div className="field-meta"><span id="story-error" className={error?'field-error':''}>{error || (story.trim().length > 0 && story.trim().length < 30 ? `${30-story.trim().length} more characters needed` : 'At least 30 characters')}</span><span id="story-count" className={story.length>1900?'count-warn':''}>{story.length.toLocaleString()} / 2,000</span></div>
      <div className="form-heading difficulty-heading"><span>02 / THE DIFFICULTY</span><span>CHOOSE ONE</span></div>
      <div className="difficulty-options" role="radiogroup" aria-label="Choose case difficulty">{levels.map((level,i)=><button key={level.id} type="button" role="radio" aria-checked={difficulty===level.id} className={`difficulty-card ${difficulty===level.id?'active':''}`} onClick={()=>setDifficulty(level.id)}><span className="difficulty-index">0{i+1}</span><span className="difficulty-name">{level.name}</span><span className="difficulty-detail">{level.detail}</span>{difficulty===level.id&&<Check className="difficulty-check" size={16}/>}</button>)}</div>
      {error && <div className="form-error" role="alert">{error}</div>}
      <Button type="submit" disabled={loading} className="generate-button">{loading?<><LoaderCircle size={17} className="spin"/> Building your case…</>:<>Generate the case <Sparkles size={16}/></>}</Button>
      <div className="generation-caption"><span className="live-dot"/> Case generation can take up to 5 minutes <span>·</span> One unique solution</div>
      <FictionNote/>
    </form>
  </main><div className="create-footer shell"><span>AI MYSTERY ROOM</span><span>THE TRUTH IS IN THE DETAILS <ArrowRight size={13}/></span></div></div>;
}
