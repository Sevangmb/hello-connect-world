
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOutfits } from '@/hooks/useOutfits';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface JoinChallengeDialogProps {
  challengeId: string;
  onJoin: (outfitId: string, comment: string) => Promise<void>;
  onClose: () => void;
  isOpen?: boolean;
}

export const JoinChallengeDialog: React.FC<JoinChallengeDialogProps> = ({ 
  challengeId, 
  onJoin,
  onClose,
  isOpen = false 
}) => {
  const [selectedOutfitId, setSelectedOutfitId] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const outfitsResult = useOutfits();
  const outfits = outfitsResult.outfits || [];
  const loading = outfitsResult.loading || false;

  const handleSubmit = async () => {
    if (!selectedOutfitId) return;
    
    try {
      setIsSubmitting(true);
      await onJoin(selectedOutfitId, comment);
      onClose();
    } catch (error) {
      console.error('Error joining challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Participer au défi</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="outfit">Choisir une tenue</Label>
            <Select 
              value={selectedOutfitId} 
              onValueChange={setSelectedOutfitId}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une tenue" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : outfits && outfits.length > 0 ? (
                  outfits.map(outfit => (
                    <SelectItem key={outfit.id} value={outfit.id}>
                      {outfit.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Aucune tenue disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre inspiration pour cette tenue..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOutfitId || isSubmitting}
          >
            {isSubmitting ? 'Envoi...' : 'Participer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
