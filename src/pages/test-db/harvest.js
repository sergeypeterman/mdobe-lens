import { SETTINGS_TYPES } from "@/components/constants";
import { useState } from "react";
import Head from "next/head";

export default function Harvest() {
  const [harvesting, setHarvesting] = useState(false);
  const [donePercent, setDonePercent] = useState(0);

  return (
    <>
      <Head>
        <title>Harvester</title>
      </Head>
      <main>
        <form method="POST">
            <button>Harvest</button>
        </form>
      </main>
    </>
  );
}
