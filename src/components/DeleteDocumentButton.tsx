"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteDocument } from "@/app/dashboard/actions";

export default function DeleteDocumentButton({
  documentId,
  fileUrl,
}: {
  documentId: string;
  fileUrl: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isConfirmOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsConfirmOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isConfirmOpen]);

  const handleDelete = async () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);
    const toastId = toast.loading("Đang xóa tài liệu...");

    try {
      const res = await deleteDocument(documentId, fileUrl);
      if (res?.error) {
        throw new Error(res.error);
      }
      toast.success("Đã xóa tài liệu thành công!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa tài liệu", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        className="px-2"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
        title="Xóa tài liệu"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>

      {isConfirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-document-title"
          aria-describedby="delete-document-description"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsConfirmOpen(false)}
          />
          <Card className="relative w-full max-w-md shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle id="delete-document-title">Xóa tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                id="delete-document-description"
                className="text-sm text-muted-foreground"
              >
                Bạn có chắc chắn muốn xóa tài liệu này? Mọi dữ liệu trắc nghiệm
                và lịch sử chat cũng sẽ bị xóa theo.
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isDeleting}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                Xóa
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </>
  );
}
