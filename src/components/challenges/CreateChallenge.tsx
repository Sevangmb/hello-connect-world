
import { Button } from "@/components/ui/button";
import { ClothesHashtags } from "@/components/clothes/forms/ClothesHashtags";
import { ChallengeBasicInfo } from "./forms/ChallengeBasicInfo";
import { ChallengeDates } from "./forms/ChallengeDates";
import { ChallengeParticipationSettings } from "./forms/ChallengeParticipationSettings";
import { useChallengeSubmit } from "@/hooks/useChallengeSubmit";
import { useEffect, useState } from "react";

export const CreateChallenge = () => {
  const {
    formData: {
      title,
      description,
      rules,
      rewardDescription,
      startDate: startDateString,
      endDate: endDateString,
      participationType,
      isVotingEnabled,
    },
    setters: {
      setTitle,
      setDescription,
      setRules,
      setRewardDescription,
      setStartDate: setStartDateString,
      setEndDate: setEndDateString,
      setParticipationType,
      setIsVotingEnabled,
      setHashtags,
    },
    handleSubmit,
  } = useChallengeSubmit();

  // États locaux pour les dates au format Date, convertis à partir des chaînes de dates
  const [startDate, setStartDate] = useState(startDateString ? new Date(startDateString) : new Date());
  const [endDate, setEndDate] = useState(endDateString ? new Date(endDateString) : new Date());

  // Propagation des changements de dates entre les états Date et les chaînes de date
  useEffect(() => {
    if (startDateString) {
      setStartDate(new Date(startDateString));
    }
  }, [startDateString]);

  useEffect(() => {
    if (endDateString) {
      setEndDate(new Date(endDateString));
    }
  }, [endDateString]);

  // Handlers pour gérer les changements de dates
  const handleStartDateChange = (value: string) => {
    setStartDateString(value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDateString(value);
  };

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
        startDate={startDateString || ""}
        endDate={endDateString || ""}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
      
      <ChallengeParticipationSettings
        participationType={participationType as "virtual" | "photo"}
        isVotingEnabled={isVotingEnabled}
        onParticipationTypeChange={(value) => setParticipationType(value)}
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
