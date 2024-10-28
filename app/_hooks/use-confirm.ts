// import { useState } from "react";
// import { ButtonProps } from "../_components/ui/button";

// export const useConfirm = () => {
//   const [promise, setPromise] = useState<{
//     resolve: (value: boolean) => void;
//   } | null>();

//   const confirm = () => {
//     return new Promise((resolve) => {
//       setPromise({ resolve });
//     });
//   };

//   const handleClose = () => {
//     setPromise(null);
//   };

//   const handleConfirm = () => {
//     promise?.resolve(true);
//     handleClose();
//   };

//   const handleCancle = () => {
//     promise?.resolve(false);
//     handleClose();
//   };

//   return { handleCancle, handleConfirm, confirm, promise };
// };
