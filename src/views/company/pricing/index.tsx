import React from "react";
import { Card } from "@/components/ui";
import PaymentDialog from "./PaymentDialog";
import Plans from "./Plans";
import { useUserContext } from "../../../context/userContext";

const Pricing = () => {
  const { refetchUser } = useUserContext();

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-8">
          <h3>Pricing</h3>
          {/* <PaymentCycleToggle /> */}
        </div>
        <Plans />
      </Card>
      <PaymentDialog onSubmit={refetchUser} />
    </>
  );
}

export default Pricing;