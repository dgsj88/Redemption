import { GmailSetupGuide } from "@/components/gmail-setup-guide"

export default function GmailSetupGuidePage() {
  return <GmailSetupGuide onBack={() => window.history.back()} />
}
