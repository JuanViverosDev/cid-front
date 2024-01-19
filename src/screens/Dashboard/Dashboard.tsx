import { Titles } from '../../components';
import Chart from 'react-apexcharts';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { ModalTable } from './components';
import { useEffect, useState } from 'react';
import { getDashboardData } from '../../services/dashboard.service';
import { useFetchAndLoad } from '../../hooks';

export const Dashboard = () => {
  const { callEndpoint } = useFetchAndLoad();

  const [openModal, setOpenModal] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [itemSelected, setItemSelected] = useState<any>(null);
  const [typeItem, setTypeItem] = useState<any>(null);

  const series = [
    {
      data: [0,0,0,0,0,0,0 ],
    },
  ];

  const options = {
    //data on the x-axis
    chart: { id: 'bar-chart' },
    xaxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    },

    //colors
    colors: ['#fbbf24'],

    //tooltip
    tooltip: {
      y: {
        formatter: function (val: any) {
          return;
        },
      },
    },

    //grid
    grid: {
      borderColor: '#f1f1f1',
    },

    //legend
    legend: {
      show: false,
    },

    //responsive
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],

    //animation
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },

    //stroke
    stroke: {
      curve: 'smooth',
    },

    //fill
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#E8423F'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },

    //markers
    markers: {
      size: 4,
      colors: ['#fbbf24'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },

    //data labels
    dataLabels: {
      enabled: false,
    },

    //title
    title: {
      text: 'Historial Quejas',
      align: 'left',
      style: {
        fontSize: '20px',
        // color: "#E8423F",
      },
    },
  };

  useEffect(() => {
    const getData = async () => {
      const response = await callEndpoint(getDashboardData());
      setDashboardData(response?.data);
    };
    getData();
  }, []);

  return (
    <>
      <Titles title="Dashboard" moduleDescription="Module Description" />
      <div className="grid grid-cols-11 ml-27 mr-27 mt-4 bg-white w-auto rounded p-5">
        <div className="mr-5 flex flex-col col-span-5">
          <label className="text-gray-500 text-sm">Desde:</label>
          <input type="date" className="border border-gray-300 rounded-lg p-2" />
        </div>
        <div className="mr-5 flex flex-col col-span-5">
          <label className="text-gray-500 text-sm">Hasta:</label>
          <input type="date" className="border border-gray-300 rounded-lg p-2" />
        </div>
        <button
          className="bg-primary text-white rounded-lg p-2 col-span-1 mt-5 font-semibold"
          onClick={() => {
          }}
        >
          Buscar
        </button>
      </div>
      <div className="grid grid-cols-3 ml-27 mr-27 mt-29 gap-5">
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.quejasReparto);
            setTypeItem('quejasReparto');
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Quejas en reparto</div>
          <div className="text-3xl font-bold text-gray-800">{dashboardData?.quejasReparto?.length}</div>
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.autosInhibitorios);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos inhibitorios ejecutoriados</div>
          <div className="text-3xl font-bold text-gray-800">{dashboardData?.autosInhibitorios?.length}</div>
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.autosInicioIndagacionPrevia);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos de inicio de indagación previa</div>
          <div className="text-3xl font-bold text-gray-800">{dashboardData?.autosInicioIndagacionPrevia?.length}</div>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.autosArchivoIndagacionPrevia);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos de archivo de indagación previa</div>
          <div className="text-3xl font-bold text-gray-800">{dashboardData?.autosArchivoIndagacionPrevia?.length}</div>
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.autosInicioInvestigacionDisciplinaria);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos de inicio de investigación disciplinaria</div>
          <div className="text-3xl font-bold text-gray-800">
            {dashboardData?.autosInicioInvestigacionDisciplinaria?.length}
          </div>
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.autosArchivoInvestigacionDisciplinaria);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos de archivo de investigación disciplinaria</div>
          <div className="text-3xl font-bold text-gray-800">
            {dashboardData?.autosArchivoInvestigacionDisciplinaria?.length}
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.autosCitacionAudiencia);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos de citación audiencia y formulación de cargos</div>
          <div className="text-3xl font-bold text-gray-800">{dashboardData?.autosCitacionAudiencia?.length}</div>
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected([]);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos de fallos</div>
          <div className="text-3xl font-bold text-gray-800">0</div>
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected([]);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Autos de fallos absolutorios y sancionatorios</div>
          <div className="text-3xl font-bold text-gray-800">0</div>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg p-4"
          onClick={() => {
            setItemSelected(dashboardData?.autosControlPreferente);
            setOpenModal(true);
          }}
        >
          <div className="text-lg text-gray-500">Controles preferentes</div>
          <div className="text-3xl font-bold text-gray-800">{dashboardData?.autosControlPreferente?.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 col-span-3">
          <Chart options={options} series={series} type="line" height="400" />
        </div>
      </div>
      {/* {openModal && ( */}
      <ModalTable
        openModal={openModal}
        setOpenModal={setOpenModal}
        itemSelected={itemSelected}
        typeItem={typeItem}
        // plantillaSelected={plantillaSelected}
        // setPublicDefenderSaved={setPublicDefenderSaved}
        // publicDefenderSaved={publicDefenderSaved}
        // typeOfCRUDAction={typeOfCRUDAction}
      />
      {/* )} */}
    </>
  );
};
