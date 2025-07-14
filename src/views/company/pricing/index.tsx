import React from "react";
import { Card } from "@/components/ui";
import PaymentDialog from "./PaymentDialog";
import Plans from "./Plans";

const Pricing = () => {
  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-8">
          <h3>Membresías</h3>
          {/* <PaymentCycleToggle /> */}
        </div>
        <Plans />
      </Card>
      <PaymentDialog />
    </>
  );
}

export default Pricing;