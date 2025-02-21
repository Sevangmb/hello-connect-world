
import { Button } from "@/components/ui/button";
import { ClothesHashtags } from "@/components/clothes/forms/ClothesHashtags";
import { ChallengeBasicInfo } from "./forms/ChallengeBasicInfo";
import { ChallengeDates } from "./forms/ChallengeDates";
import { ChallengeParticipationSettings } from "./forms/ChallengeParticipationSettings";
import { useChallengeSubmit } from "@/hooks/useChallengeSubmit";

export const CreateChallenge = () => {
  const {
    formData: {
      title,
      description,
      rules,
      rewardDescription,
      startDate,
      endDate,
      participationType,
      isVotingEnabled,
    },
    setters: {
      setTitle,
      setDescription,
      setRules,
      setRewardDescription,
      setStartDate,
      setEndDate,
      setParticipationType,
      setIsVotingEnabled,
      setHashtags,
    },
    handleSubmit,
  } = useChallengeSubmit();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ChallengeBasicInfo
        title={title}
        description={description}
        rules={rules}
        rewardDescription={rewardDescription}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onRulesChange={setRules}
        onRewardDescriptionChange={setRewardDescription}
      />
      
      <ChallengeDates
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      
      <ChallengeParticipationSettings
        participationType={participationType}
        isVotingEnabled={isVotingEnabled}
        onParticipationTypeChange={setParticipationType}
        onVotingEnabledChange={setIsVotingEnabled}
      />
      
      <ClothesHashtags
        initialHashtags={[]}
        onHashtagsChange={setHashtags}
      />
      
      <Button type="submit">Créer le défi</Button>
    </form>
  );
};
