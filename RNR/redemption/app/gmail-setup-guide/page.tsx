import { GmailSetupGuide } from "@/app/gmail-setup-guide/_components/gmail-setup-guide"

export default function GmailSetupGuidePage() {
  return <GmailSetupGuide onBack={() => window.history.back()} />
}
