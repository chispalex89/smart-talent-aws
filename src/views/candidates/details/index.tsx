import Container from '@/components/shared/Container';
import { Avatar, Card, Tooltip } from '@/components/ui';
import React from 'react';
import useFetch from '../../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { nameFormat } from '../../../helpers/textConverter';
import dayjs from 'dayjs';
import { HiPencil } from 'react-icons/hi';
import { UserApplicant } from '../../../types/user';

type CustomerInfoFieldProps = {
  title?: string;
  value?: string;
};

const CandidateInfoField = ({ title, value }: CustomerInfoFieldProps) => {
  return (
    <div>
      <span className="font-semibold">{title}</span>
      <p className="heading-text font-bold">{value}</p>
    </div>
  );
};

const CandidateDetails = () => {
  const { id } = useParams();

  const {
    data: user,
    error,
    loading,
  } = useFetch<UserApplicant>(`applicant/${id}/applicant-data`);

  return (
    <Container>
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="min-w-[330px] 2xl:min-w-[400px]">
          <Card className="w-full">
            <div className="flex justify-end">
              <Tooltip title="Edit customer">
                <button
                  className="close-button button-press-feedback"
                  type="button"
                  // onClick={handleEdit}
                >
                  <HiPencil />
                </button>
              </Tooltip>
            </div>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="flex xl:flex-col items-center gap-4 mt-6">
                <Avatar
                  size={90}
                  shape="circle"
                  src={user?.profileImage || ''}
                />
                <h4 className="font-bold">{user ? nameFormat(user) : ''}</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
                <CandidateInfoField title="Email" value={user?.email} />
                <CandidateInfoField
                  title="Phone"
                  // value={user?}
                />
                <CandidateInfoField
                  title="Date of birth"
                  value={
                    user?.applicant?.personalData[0]?.dateOfBirth
                      ? dayjs(
                          user?.applicant?.personalData[0]?.dateOfBirth
                        ).format('DD MMM YYYY')
                      : 'No especificada'
                  }
                />
                {/* <CandidateInfoField
                  title="Last Online"
                  value={dayjs
                    .unix(data.lastOnline as number)
                    .format('DD MMM YYYY hh:mm A')}
                /> */}
              </div>
            </div>
          </Card>
        </div>
        <Card className="w-full">
          {/* <Tabs defaultValue="billing">
            <TabList>
              <TabNav value="billing">Billing</TabNav>
              <TabNav value="activity">Activity</TabNav>
            </TabList>
            <div className="p-4">
              <TabContent value="billing">
                <BillingSection data={data} />
              </TabContent>
              <TabContent value="activity">
                <ActivitySection customerName={data.name} id={id as string} />
              </TabContent>
            </div>
          </Tabs> */}
        </Card>
      </div>
      {/* <Card bodyClass="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <Avatar
            size={80}
            shape="square"
            src={user?.profileImage || undefined}
          />
          <h3>{user ? nameFormat(user) : ''}</h3>
        </div>
        
      </Card> */}
    </Container>
  );
};

export default CandidateDetails;
