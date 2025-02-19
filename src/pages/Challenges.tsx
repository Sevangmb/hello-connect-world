
import { PageLayout } from "@/components/layouts/PageLayout";
import { CreateChallenge } from "@/components/challenges/CreateChallenge";
import { ChallengesList } from "@/components/challenges/ChallengesList";

const Challenges = () => {
  return (
    <PageLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Défis</h1>
        <CreateChallenge />
        <ChallengesList />
      </div>
    </PageLayout>
  );
};

export default Challenges;
