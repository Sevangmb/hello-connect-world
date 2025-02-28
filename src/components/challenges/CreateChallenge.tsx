
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

  // Convertir les chaînes de dates en objets Date pour l'interface utilisateur
  const [startDate, setStartDate] = useState<string>(startDateString || "");
  const [endDate, setEndDate] = useState<string>(endDateString || "");

  // Synchroniser les valeurs quand elles changent dans useChallengeSubmit
  useEffect(() => {
    if (startDateString) {
      setStartDate(startDateString);
    }
  }, [startDateString]);

  useEffect(() => {
    if (endDateString) {
      setEndDate(endDateString);
    }
  }, [endDateString]);

  // Gestionnaires pour les changements de dates
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setStartDateString(value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
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
        startDate={startDate}
        endDate={endDate}
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
