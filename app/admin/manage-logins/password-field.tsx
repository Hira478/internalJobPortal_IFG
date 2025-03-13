"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PasswordFieldProps {
  password: string;
  isPlaintext?: boolean;
}

export function PasswordField({
  password,
  isPlaintext = false,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      isPlaintext ? password : "Password terenkripsi tidak dapat disalin"
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Cek apakah password adalah hash bcrypt (dimulai dengan $2a$, $2b$, atau $2y$)
  const isBcryptHash = !isPlaintext && /^\$2[aby]\$\d+\$/.test(password);

  return (
    <div className="flex items-center space-x-2">
      <div className="font-mono bg-gray-100 px-2 py-1 rounded flex-1 overflow-hidden text-sm">
        {isPlaintext ? (
          isVisible ? (
            password
          ) : (
            "••••••••••"
          )
        ) : (
          <span className="text-gray-500 italic">
            {isBcryptHash ? "Encrypted (tidak dapat ditampilkan)" : password}
          </span>
        )}
      </div>
      {isPlaintext && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleVisibility}
                  className="h-8 w-8"
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVisible ? "Sembunyikan" : "Tampilkan"} password</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-8 w-8"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCopied ? "Disalin!" : "Salin password"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
}
