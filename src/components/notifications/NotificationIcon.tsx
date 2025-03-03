
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NotificationsList } from "./NotificationsList";
import { useNotificationCenter } from "@/hooks/notifications/useNotificationCenter";
import { cn } from "@/lib/utils";

interface NotificationIconProps {
  variant?: "navbar" | "sidebar";
  className?: string;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  variant = "navbar",
  className,
}) => {
  const { unreadCount } = useNotificationCenter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "navbar" ? "icon" : "sm"}
          className={cn(
            "relative",
            variant === "sidebar" && "w-full justify-start px-2",
            className
          )}
        >
          <Bell className={cn("h-5 w-5", variant === "sidebar" && "mr-2")} />
          {variant === "sidebar" && <span>Notifications</span>}
          
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 sm:w-96"
        sideOffset={variant === "navbar" ? 20 : 0}
      >
        <NotificationsList compact />
      </PopoverContent>
    </Popover>
  );
};
