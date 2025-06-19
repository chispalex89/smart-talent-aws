import React from "react";
import MembershipPlanForm from "./components/MembershipPlanForm";
import useSWR from "swr";
import apiService from "../../../../services/apiService";
import { Card } from "@/components/ui";

const MembershipCard = () => {
  const { data, mutate } = useSWR(
    "/membership-type",
    (url) => apiService.get<any[]>(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return (
    <Card bodyClass="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data &&
        data.length > 0 &&
        data.map((membership) => (
          <MembershipPlanForm
            key={membership.id}
            membership={membership}
            onUpdateMembership={(updatedMembership) => {
              mutate(
                data.map((m) =>
                  m.id === updatedMembership.id ? updatedMembership : m
                ),
                false
              );
            }}
          />
        ))}
    </Card>
  );
};
export default MembershipCard;
