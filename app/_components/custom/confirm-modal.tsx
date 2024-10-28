// "use client";

// import { useConfirm } from "@/app/_hooks/use-confirm";
// import { ResponsiveModal } from "./responsive-modal";
// import { Button, ButtonProps } from "../ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";

// interface ConfirmationModalProps {
//   title: string;
//   message: string;
//   variant: ButtonProps["variant"];
// }

// export const ConfirmationModal = ({
//   message,
//   title,
//   variant = "default",
// }: ConfirmationModalProps) => {
//   const { handleCancle, handleConfirm, promise } = useConfirm();

//   return (
//     <ResponsiveModal open={promise !== null} onOpenChange={handleCancle}>
//       <Card className="w-full h-full border-none shadow-none">
//         <CardContent className="pt-8">
//           <CardHeader className="p-0">
//             <CardTitle>{title}</CardTitle>
//             <CardDescription>{message}</CardDescription>
//           </CardHeader>
//           <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
//             <Button
//               onClick={handleCancle}
//               variant={"outline"}
//               className="w-full lg:w-auto"
//             >
//               Cancle
//             </Button>
//             <Button
//               onClick={handleConfirm}
//               variant={variant}
//               className="w-full lg:w-auto"
//             >
//               Confirm
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </ResponsiveModal>
//   );
// };
