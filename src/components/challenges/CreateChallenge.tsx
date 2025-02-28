
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
      startDate: startDateFromHook,
      endDate: endDateFromHook,
      participationType,
      isVotingEnabled,
    },
    setters: {
      setTitle,
      setDescription,
      setRules,
      setRewardDescription,
      setStartDate: setStartDateInHook,
      setEndDate: setEndDateInHook,
      setParticipationType,
      setIsVotingEnabled,
      setHashtags,
    },
    handleSubmit,
  } = useChallengeSubmit();

  // Convertir les dates en chaînes pour l'interface utilisateur
  const [startDate, setStartDate] = useState<string>(
    startDateFromHook ? 
    (typeof startDateFromHook === 'string' ? startDateFromHook : startDateFromHook.toISOString().split('T')[0]) : 
    ""
  );
  const [endDate, setEndDate] = useState<string>(
    endDateFromHook ? 
    (typeof endDateFromHook === 'string' ? endDateFromHook : endDateFromHook.toISOString().split('T')[0]) : 
    ""
  );

  // Synchroniser les valeurs quand elles changent dans useChallengeSubmit
  useEffect(() => {
    if (startDateFromHook) {
      const formattedDate = typeof startDateFromHook === 'string' 
        ? startDateFromHook 
        : startDateFromHook.toISOString().split('T')[0];
      setStartDate(formattedDate);
    }
  }, [startDateFromHook]);

  useEffect(() => {
    if (endDateFromHook) {
      const formattedDate = typeof endDateFromHook === 'string' 
        ? endDateFromHook 
        : endDateFromHook.toISOString().split('T')[0];
      setEndDate(formattedDate);
    }
  }, [endDateFromHook]);

  // Gestionnaires pour les changements de dates
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setStartDateInHook(value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setEndDateInHook(value);
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
