import { Fingerprint } from 'lucide-react';
import { Button, Eyebrow } from '../components/common.jsx';
export default function NotFoundPage(){return <main className="not-found"><Fingerprint size={34}/><Eyebrow>UNFILED EVIDENCE</Eyebrow><h1>This page isn’t<br/><em>on record.</em></h1><p>The trail ends here. Let’s get you back to the investigation room.</p><Button to="/">Return home</Button></main>;}
