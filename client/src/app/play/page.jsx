import CardGrid from "../../components/CardGrid";
import Link from "next/link";

export default function MainScreen(){
  return (
    <>
    <div className="absolute top-6 left-6 z-20 flex gap-3">
      <Link
        href="/"
        className="ui-nav-btn bg-amber-100 text-amber-900 border-2 border-yellow-700"
      >
        ← Back to Homepage
      </Link>
      <Link
        href="/leaderboard"
        className="ui-nav-btn bg-amber-100 text-amber-900 border-2 border-yellow-700"
      >
        Go to Leaderboard
      </Link>
    </div>
    <CardGrid />
    </>
  )
}