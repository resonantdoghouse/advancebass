import { redirect } from 'next/navigation';

export default function StrudelGeneratorRootRedirect() {
  // Always safely redirect to a default layout on root index
  redirect('/tools/strudel-generator/teen-town');
}
