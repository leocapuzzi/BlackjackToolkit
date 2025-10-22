import { Button } from "@/components/ui/button";
import { CARD_COLORS } from "@/lib/zenCount";

interface CardButtonGroupProps {
  owner: "player" | "dealer" | "others";
  onCardClick: (card: string) => void;
}

const CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default function CardButtonGroup({ owner, onCardClick }: CardButtonGroupProps) {
  const ownerLabels = {
    player: "Player Cards",
    dealer: "Dealer Cards",
    others: "Other Players Cards",
  };

  return (
    <div className="glass p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-purple-200 mb-3">{ownerLabels[owner]}</h3>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-7">
        {CARDS.map((card) => {
          const colorInfo = CARD_COLORS[card];
          const bgColor = colorInfo.bg + " hover:opacity-90";

          return (
            <Button
              key={`${owner}-${card}`}
              onClick={() => onCardClick(card)}
              className={`${bgColor} ${colorInfo.text} h-10 text-xs font-bold transition-all duration-200 transform hover:scale-105 active:scale-95`}
            >
              {card}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

