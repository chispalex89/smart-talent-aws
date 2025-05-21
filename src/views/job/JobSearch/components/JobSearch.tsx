import React, { useEffect, useState } from 'react';
import useJobOfferList from '../hooks/useJobOfferList';
import {
  Avatar,
  Button,
  Card,
  Pagination,
  Select,
  toast,
  Tooltip,
} from '@/components/ui';
import Notification from '@/components/ui/Notification';
import { BsBriefcase, BsCheck2Circle, BsStar } from 'react-icons/bs';
import { PiMoney } from 'react-icons/pi';
import { MdLocationPin } from 'react-icons/md';
import { Link } from 'react-router-dom';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';
import useFetch from 'src/hooks/useFetch';
import { JobOfferDetails } from '../../JobDetails/types';
import { JobOffer } from '@prisma/client';

type Option = {
  value: number;
  label: string;
};

const options: Option[] = [
  { value: 10, label: '10 / página' },
  { value: 20, label: '20 / página' },
  { value: 50, label: '50 / página' },
];

const JobSearch = () => {
  const {
    jobOfferList,
    jobOfferListTotal,
    tableData,
    isLoading,
    setTableData,
    mutate,
  } = useJobOfferList();
  const [pageSize, setPageSize] = useState(options[0].value);
  const { applicant } = useUserContext();

  useEffect(() => {
    const pagination = window.localStorage.getItem('jobSearchPagination');
    if (pagination) {
      const { pageIndex, pageSize } = JSON.parse(pagination);
      setPageSize(pageSize);
      setTableData({
        ...tableData,
        pageIndex,
        pageSize,
      });
      window.localStorage.removeItem('jobSearchPagination');
    }
  }, []);

  useEffect(() => {
    if (applicant) {
    }
  }, [applicant]);

  const onPageSizeSelect = ({ value }: Option) => {
    setPageSize(value);
    setTableData({
      ...tableData,
      pageIndex: 1,
      pageSize: value,
    });
  };

  const onPaginationChange = (val: number) => {
    setTableData({
      ...tableData,
      pageIndex: val,
      pageSize,
    });
  };

  const renderPagination = () => (
    <div className="grid md:grid-cols-6 gap-4">
      <Pagination
        displayTotal
        currentPage={tableData.pageIndex}
        pageSize={pageSize}
        total={jobOfferListTotal}
        itemDescription="Empleos"
        className="col-span-5 justify-center"
        onChange={onPaginationChange}
      />
      <div style={{ minWidth: 120 }}>
        <Select
          size="sm"
          isSearchable={false}
          defaultValue={options[0]}
          options={options}
          value={options.filter((option) => option.value === pageSize)}
          onChange={(selected) => onPageSizeSelect(selected as Option)}
        />
      </div>
    </div>
  );

  const handleApply = async (jobDetails: JobOffer) => {
    try {
      const response = await apiService.post('/job-applicant', {
        applicantId: applicant!.id,
        jobId: jobDetails!.id,
        jobUuid: jobDetails!.uuid,
      });

      if (!response) {
        throw new Error('No se pudo aplicar a la oferta');
      }

      toast.push(<Notification type="info">Aplicación enviada</Notification>, {
        placement: 'top-center',
      });
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al enviar la aplicación
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    }
  };

  return (
    <>
      {renderPagination()}
      <div className="grid md:grid-cols-2 gap-4">
        {jobOfferList.map((offer) => {
          const isApplied = offer.jobApplicants
            .map((x: any) => x.applicantId)
            .includes(applicant!.id);
          return (
            <Card>
              <div className="grid md:grid-cols-12 gap-4">
                <Avatar
                  alt={offer.company.name}
                  src={offer.company.logoUrl || undefined}
                  shape="square"
                  size={100}
                  className="col-span-2"
                />

                <h3
                  className="col-span-7 flex items-center justify-center"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textDecoration: 'underline',
                    textDecorationColor: '#80ADFF',
                    textDecorationThickness: '2px',
                    textDecorationStyle: 'solid',
                    textUnderlineOffset: '2px',
                    color: '#5994FF',
                  }}
                  title={offer.name}
                >
                  <Link
                    to={`/job/${offer.uuid}`}
                    onClick={() => {
                      window.localStorage.setItem(
                        'jobSearchPagination',
                        JSON.stringify({
                          pageIndex: tableData.pageIndex,
                          pageSize,
                        })
                      );
                    }}
                  >
                    {offer.name}
                  </Link>
                </h3>
                <div className="col-span-3 flex flex-col items-center justify-center gap-2">
                  {isApplied ? (
                    <Tooltip
                      wrapperClass="flex w-full"
                      title="Ya has aplicado a esta oferta"
                    >
                      <Button
                        variant="success"
                        disabled={true}
                        className="w-full flex flex-row items-center justify-center gap-1"
                      >
                        <BsCheck2Circle />
                        Aplicar
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => handleApply(offer)}
                      className="w-full flex flex-row items-center justify-center gap-1"
                    >
                      <BsCheck2Circle />
                      Aplicar
                    </Button>
                  )}
                  <Button
                    variant="warning"
                    onClick={() => {}}
                    className="w-full flex flex-row items-center justify-center gap-1"
                  >
                    <BsStar />
                    Favorito
                  </Button>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex flex-row items-center gap-1">
                  <BsBriefcase /> {offer.company.name}
                </div>
                <div className="flex flex-row items-center gap-1">
                  <PiMoney /> {offer.salary_range.range}
                </div>
                <div className="flex flex-row items-center gap-1">
                  <MdLocationPin /> {offer.city.name}
                </div>
                <div className="flex flex-row items-center gap-1">
                  <BsBriefcase /> {offer.contract_type.name}
                </div>
              </div>
              <Card
                style={{
                  whiteSpace: 'wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: '350px',
                }}
              >
                {offer.publicDescription ?? offer.description}
              </Card>
            </Card>
          );
        })}
      </div>
      {renderPagination()}
    </>
  );
};

export default JobSearch;
