import React, { useState } from 'react';
import useJobOfferList from '../hooks/useJobOfferList';
import { Avatar, Button, Card, Pagination, Select } from '@/components/ui';
import { BsBriefcase, BsCheck2Circle, BsStar } from 'react-icons/bs';
import { PiMoney } from 'react-icons/pi';
import { MdLocationPin } from 'react-icons/md';

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
  const [page, setPage] = useState(1);

  const onPageSelect = ({ value }: Option) => {
    setPageSize(value);
    setPage(1);
    setTableData({
      ...tableData,
      pageIndex: 1,
      pageSize: value,
    });
  };

  const onPaginationChange = (val: number) => {
    setPage(val);
    console.log(val);
    setTableData({
      ...tableData,
      pageIndex: page,
      pageSize: val,
    });
  };

  const renderPagination = () => (
    <div className="grid md:grid-cols-6 gap-4">
      <Pagination
        displayTotal
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
          onChange={(selected) => onPageSelect(selected as Option)}
        />
      </div>
    </div>
  );

  return (
    <>
      {renderPagination()}
      <div className="grid md:grid-cols-2 gap-4">
        {jobOfferList.map((offer) => (
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
                }}
                title={offer.name}
              >
                {offer.name}
              </h3>
              <div className="col-span-3 flex flex-col items-center justify-center gap-2">
                <Button
                  variant="success"
                  onClick={() => {}}
                  className="w-full flex flex-row items-center justify-center gap-1"
                >
                  <BsCheck2Circle />
                  Aplicar
                </Button>
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
        ))}
      </div>
      {renderPagination()}
    </>
  );
};

export default JobSearch;
