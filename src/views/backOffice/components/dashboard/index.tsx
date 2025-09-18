import React from 'react';
import useFetch from '../../../../hooks/useFetch';
import { Card, Spinner } from '@/components/ui';
import Chart from '@/components/shared/Chart';
import { COLORS } from '@/constants/chart.constant';

export interface DashboardData {
  activeApplicants: number;
  activeCompanies: number;
  activeJobOffers: number;
  publishedJobOffers: number;
  totalApplicants: number;
  totalCompanies: number;
}

const BackOfficeDashboard = () => {
  const { data, loading } = useFetch<DashboardData>('/dashboard');

  return loading ? (
    <Spinner className="flex items-center justify-center h-screen" />
  ) : (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Candidatos Activos</h2>
          <p className="text-2xl">{data?.activeApplicants || 0}</p>
          <Chart
            type="donut"
            series={[
              data?.activeApplicants || 0,
              data?.activeApplicants
                ? data?.totalApplicants - data?.activeApplicants
                : 0,
            ]}
            customOptions={{
              colors: [COLORS[0], COLORS[7], COLORS[8]],
              labels: ['Candidatos Activos', 'Candidatos Inactivos'],
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        showAlways: true,
                        label: '',
                        formatter: function () {
                          return '';
                        },
                      },
                    },
                    size: '75%',
                  },
                },
              },
            }}
          />
        </Card>
        <Card className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Compañías Activas</h2>
          <p className="text-2xl">{data?.activeCompanies || 0}</p>
          <Chart
            type="donut"
            series={[
              data?.activeCompanies || 0,
              data?.activeCompanies
                ? data?.totalCompanies - data?.activeCompanies
                : 0,
            ]}
            customOptions={{
              colors: [COLORS[0], COLORS[7], COLORS[8]],
              labels: ['Compañías Activas', 'Compañías Inactivas'],
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        showAlways: true,
                        label: '',
                        formatter: function () {
                          return '';
                        },
                      },
                    },
                    size: '75%',
                  },
                },
              },
            }}
          />
        </Card>
        <Card className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Empleos Publicados</h2>
          <p className="text-2xl">{data?.activeJobOffers || 0}</p>
          <Chart
            type="donut"
            series={[
              data?.publishedJobOffers || 0,
              data?.publishedJobOffers
                ? data?.activeJobOffers - data?.publishedJobOffers
                : 0,
            ]}
            customOptions={{
              colors: [COLORS[0], COLORS[7], COLORS[8]],
              labels: ['Empleos Publicados', 'Empleos No Publicados'],
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        showAlways: true,
                        label: '',
                        formatter: function () {
                          return '';
                        },
                      },
                    },
                    size: '75%',
                  },
                },
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default BackOfficeDashboard;
