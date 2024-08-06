//import "chart.js/auto"; this import everything from chart js
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import Image from "next/image";
import { STYLE } from "@/components/constants";
import { useEffect } from "react";

export function SalesChart({
  setShowCardDetails,
  showCardDetails,
  getDetailsFromDB,
}) {

  //*******Chart functions******************************************/

  const closeDetailsWindow = () => {
    const newCardDetails = JSON.parse(JSON.stringify(showCardDetails));
    newCardDetails.status = false;
    newCardDetails.assetToDisplay = -1;
    setShowCardDetails(newCardDetails);
  };

  /*   const labelsTest = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ]; */

  //const LineChart = ({ dataToDisplay }) => {
  //const sortedData = [...dataToDisplay].sort((a, b) => new Date(a.dateRecorded) - new Date(b.dateRecorded));

  const chartData = {
    labels: showCardDetails.dataToDisplay.sales.reduce((acc, item) => {
      const dateRecordedFormatted = new Date(
        item.dateRecorded
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      acc.push(dateRecordedFormatted);
      return acc;
    }, []),
    datasets: [
      {
        label: "Number of Downloads",
        //data: [65, 59, 80, 81, 56, 55, 40],
        data: showCardDetails.dataToDisplay.sales.reduce((acc, item) => {
          acc.push(item.nbDownloads);
          return acc;
        }, []),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    resizeDelay: 0,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Downloads Over Time",
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            return new Date(
              showCardDetails.dataToDisplay.sales[index].dateRecorded
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Downloads",
        },
        beginAtZero: true,
      },
    },
  };

  //*******Chart functions******************************************/
  return (
    <>
      <div
        id="statistics-screen-background"
        className={`fixed top-0 opacity-100 backdrop-filter backdrop-blur-sm backdrop-brightness-50 w-full h-full
            z-50`}
      ></div>
      <div
        className={`fixed top-0 flex items-center justify-center z-50 w-full h-full `}
      >
        <div
          id="statistics-screen"
          className={`${STYLE.backColor} rounded-md w-full h-full md:w-3/5 md:h-4/5 flex flex-col justify-around items-center p-4`}
        >
          <Image
            className="image-contain p-2 grow"
            alt={showCardDetails.assetToDisplay.title}
            src={showCardDetails.assetToDisplay.thumbnail_url}
            width={showCardDetails.assetToDisplay.thumbnail_width}
            height={showCardDetails.assetToDisplay.thumbnail_height}
          />
          {/*           <div className="flex grow overflow-hidden flex-wrap w-full">
            {JSON.stringify(showCardDetails.dataToDisplay)}
          </div> */}
          <div
            className={`flex grow-[3] items-center justify-center w-full h-full`}
          >
            <Line data={chartData} options={chartOptions} />
          </div>
          <button
            className={`${STYLE.button} grow mt-2`}
            onClick={closeDetailsWindow}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
