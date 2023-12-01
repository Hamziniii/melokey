import { useEffect, useState } from "react";
import { sdkPropsAtom } from "../../globals/store";
import { useStore } from "@nanostores/react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const EnergyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="m53.13,166.17H13.12c-5.16,0-8.98-2.31-11.45-6.94-2.47-4.62-2.2-9.09.81-13.39L98.93,7.14c2.15-3.01,4.95-5.11,8.39-6.29,3.44-1.18,6.99-1.13,10.65.16,3.66,1.29,6.34,3.55,8.06,6.77,1.72,3.23,2.37,6.67,1.94,10.32l-10.32,83.55h50c5.59,0,9.52,2.47,11.77,7.42,2.26,4.95,1.56,9.57-2.1,13.87l-106.13,127.1c-2.37,2.8-5.27,4.62-8.71,5.48-3.44.86-6.77.54-10-.97-3.23-1.51-5.75-3.82-7.58-6.94s-2.53-6.51-2.1-10.16l10.32-71.29Z" />
    <rect x="152.53" y="26.99" width="82.13" height="14" transform="translate(32.68 146.85) rotate(-45)" />
    <rect x="178.4" y="60.97" width="70.48" height="14" transform="translate(-10.42 75.82) rotate(-19.65)" />
    <rect x="211.69" y="75.08" width="14" height="71.09" transform="translate(61.62 298.76) rotate(-76.97)" />
  </svg>
);

const InstrumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="m28.44,256c-7.82,0-14.52-2.79-20.09-8.36-5.57-5.57-8.36-12.27-8.36-20.09V28.44c0-7.82,2.79-14.52,8.36-20.09C13.93,2.79,20.62,0,28.44,0h199.11c7.82,0,14.52,2.79,20.09,8.36s8.36,12.27,8.36,20.09v199.11c0,7.82-2.79,14.52-8.36,20.09-5.57,5.57-12.27,8.36-20.09,8.36H28.44Zm0-28.44h46.22v-64h-3.56c-4.03,0-7.41-1.36-10.13-4.09-2.73-2.73-4.09-6.1-4.09-10.13V28.44h-28.44v199.11Zm152.89,0h46.22V28.44h-28.44v120.89c0,4.03-1.36,7.41-4.09,10.13s-6.1,4.09-10.13,4.09h-3.56v64Zm-85.33,0h64v-64h-3.56c-4.03,0-7.41-1.36-10.13-4.09s-4.09-6.1-4.09-10.13V28.44h-28.44v120.89c0,4.03-1.36,7.41-4.09,10.13s-6.1,4.09-10.13,4.09h-3.56v64Z" />
  </svg>
);

const ValenceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="m128,204.8c14.08,0,26.13-5.01,36.16-15.04,10.03-10.03,15.04-22.08,15.04-36.16v-12.8c0-3.63-1.23-6.67-3.68-9.12s-5.49-3.68-9.12-3.68h-76.8c-3.63,0-6.67,1.23-9.12,3.68s-3.68,5.49-3.68,9.12v12.8c0,14.08,5.01,26.13,15.04,36.16,10.03,10.03,22.08,15.04,36.16,15.04Zm0-19.2c-8.96,0-16.53-3.09-22.72-9.28s-9.28-13.76-9.28-22.72v-6.4h64v6.4c0,8.96-3.09,16.53-9.28,22.72s-13.76,9.28-22.72,9.28Zm-44.8-121.6c-7.25,0-13.65,2.35-19.2,7.04-5.55,4.69-9.81,10.45-12.8,17.28-1.07,2.35-.91,4.59.48,6.72s3.36,3.52,5.92,4.16c2.35.64,4.69.37,7.04-.8s4.05-2.93,5.12-5.28c1.49-2.77,3.36-5.12,5.6-7.04s4.85-2.88,7.84-2.88,5.6,1.01,7.84,3.04,4.11,4.43,5.6,7.2c1.07,2.35,2.77,4.05,5.12,5.12s4.69,1.28,7.04.64c2.56-.64,4.53-2.03,5.92-4.16s1.55-4.37.48-6.72c-2.99-6.83-7.25-12.59-12.8-17.28s-11.95-7.04-19.2-7.04Zm89.6,0c-7.25,0-13.65,2.35-19.2,7.04s-9.81,10.45-12.8,17.28c-1.07,2.35-.91,4.59.48,6.72s3.36,3.52,5.92,4.16c2.35.64,4.69.37,7.04-.8s4.05-2.93,5.12-5.28c1.49-2.77,3.36-5.12,5.6-7.04s4.85-2.88,7.84-2.88,5.6,1.01,7.84,3.04,4.11,4.43,5.6,7.2c1.07,2.35,2.77,4.05,5.12,5.12s4.69,1.28,7.04.64c2.56-.64,4.53-2.03,5.92-4.16s1.55-4.37.48-6.72c-2.99-6.83-7.25-12.59-12.8-17.28s-11.95-7.04-19.2-7.04Zm-44.8,192c-17.71,0-34.35-3.36-49.92-10.08-15.57-6.72-29.12-15.84-40.64-27.36-11.52-11.52-20.64-25.07-27.36-40.64S0,145.71,0,128s3.36-34.35,10.08-49.92,15.84-29.12,27.36-40.64c11.52-11.52,25.07-20.64,40.64-27.36C93.65,3.36,110.29,0,128,0s34.35,3.36,49.92,10.08,29.12,15.84,40.64,27.36c11.52,11.52,20.64,25.07,27.36,40.64s10.08,32.21,10.08,49.92-3.36,34.35-10.08,49.92-15.84,29.12-27.36,40.64c-11.52,11.52-25.07,20.64-40.64,27.36s-32.21,10.08-49.92,10.08Z" />
  </svg>
);

const SpeechinessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="m10.24,64c-3.2-3.63-5.71-7.57-7.52-11.84s-2.72-8.85-2.72-13.76c0-10.67,3.73-19.73,11.2-27.2S27.73,0,38.4,0s19.73,3.73,27.2,11.2,11.2,16.53,11.2,27.2c0,4.91-.91,9.49-2.72,13.76s-4.32,8.21-7.52,11.84H10.24Zm66.56,192c-14.08,0-26.13-5.01-36.16-15.04-10.03-10.03-15.04-22.08-15.04-36.16h-1.28c-3.41,0-6.29-1.12-8.64-3.36s-3.73-4.96-4.16-8.16L1.28,90.88c-.43-3.84.64-7.15,3.2-9.92s5.76-4.16,9.6-4.16h48.64c3.84,0,7.04,1.39,9.6,4.16s3.63,6.08,3.2,9.92l-10.24,102.4c-.43,3.2-1.81,5.92-4.16,8.16s-5.23,3.36-8.64,3.36h-1.28c0,7.04,2.51,13.07,7.52,18.08,5.01,5.01,11.04,7.52,18.08,7.52s13.07-2.51,18.08-7.52,7.52-11.04,7.52-18.08V51.2c0-14.08,5.01-26.13,15.04-36.16C127.47,5.01,139.52,0,153.6,0s26.13,5.01,36.16,15.04c10.03,10.03,15.04,22.08,15.04,36.16v192c0,3.63-1.23,6.67-3.68,9.12s-5.49,3.68-9.12,3.68-6.67-1.23-9.12-3.68-3.68-5.49-3.68-9.12V51.2c0-7.04-2.51-13.07-7.52-18.08s-11.04-7.52-18.08-7.52-13.07,2.51-18.08,7.52-7.52,11.04-7.52,18.08v153.6c0,14.08-5.01,26.13-15.04,36.16-10.03,10.03-22.08,15.04-36.16,15.04Z" />
  </svg>
);

const LoudnessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="m197.54,63.56l-18.1,18.1c-2.56,2.56-5.58,3.85-9.05,3.85-3.47,0-6.49-1.28-9.05-3.85s-3.85-5.58-3.85-9.05c0-3.47,1.28-6.49,3.85-9.05l18.1-18.1c2.56-2.56,5.58-3.85,9.05-3.85,3.47,0,6.49,1.28,9.05,3.85s3.85,5.58,3.85,9.05c0,3.47-1.28,6.49-3.85,9.05Zm-5.43,74.22c-.6-3.62.15-6.79,2.26-9.5,2.11-2.72,4.98-4.37,8.6-4.98l25.34-3.62c3.62-.6,6.79.15,9.5,2.26s4.37,4.98,4.98,8.6c.6,3.62-.15,6.79-2.26,9.5s-4.98,4.37-8.6,4.98l-25.34,3.62c-3.62.6-6.79-.15-9.5-2.26-2.72-2.11-4.37-4.98-4.98-8.6ZM123.32,14.68l-3.62,25.34c-.6,3.62-2.26,6.49-4.98,8.6-2.72,2.11-5.88,2.87-9.5,2.26-3.62-.6-6.49-2.26-8.6-4.98-2.11-2.72-2.87-5.88-2.26-9.5l3.62-25.34c.6-3.62,2.26-6.49,4.98-8.6,2.72-2.11,5.88-2.87,9.5-2.26,3.62.6,6.49,2.26,8.6,4.98,2.11,2.72,2.87,5.88,2.26,9.5Zm-52.5,211.79l-9.05,9.05c-4.98,4.98-11.01,7.47-18.1,7.47-7.09,0-13.12-2.49-18.1-7.47l-18.1-18.1C2.49,212.45,0,206.41,0,199.32c0-7.09,2.49-13.12,7.47-18.1l36.2-36.2,12.45-50.46c1.21-4.83,4.26-7.88,9.16-9.16,4.9-1.28,9.09-.19,12.56,3.28l76.48,76.48c3.47,3.47,4.56,7.66,3.28,12.56-1.28,4.9-4.34,7.96-9.16,9.16l-50.46,12.45-9.05,9.05,27.15,27.15c2.56,2.56,3.85,5.58,3.85,9.05s-1.28,6.49-3.85,9.05-5.58,3.85-9.05,3.85-6.49-1.28-9.05-3.85l-27.15-27.15Zm84.63-78.29l-60.64-60.64c7.69-.45,15.39.68,23.08,3.39,7.69,2.72,14.63,7.17,20.82,13.35,6.18,6.18,10.63,13.12,13.35,20.82s3.85,15.39,3.39,23.08Z" />
  </svg>
);

const DanceabilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="m51.2,192V64c0-3.63,1.23-6.67,3.68-9.12,2.45-2.45,5.49-3.68,9.12-3.68s6.67,1.23,9.12,3.68,3.68,5.49,3.68,9.12v128c0,3.63-1.23,6.67-3.68,9.12-2.45,2.45-5.49,3.68-9.12,3.68s-6.67-1.23-9.12-3.68c-2.45-2.45-3.68-5.49-3.68-9.12Zm51.2,51.2V12.8c0-3.63,1.23-6.67,3.68-9.12s5.49-3.68,9.12-3.68,6.67,1.23,9.12,3.68c2.45,2.45,3.68,5.49,3.68,9.12v230.4c0,3.63-1.23,6.67-3.68,9.12-2.45,2.45-5.49,3.68-9.12,3.68s-6.67-1.23-9.12-3.68-3.68-5.49-3.68-9.12ZM0,140.8v-25.6c0-3.63,1.23-6.67,3.68-9.12,2.45-2.45,5.49-3.68,9.12-3.68s6.67,1.23,9.12,3.68,3.68,5.49,3.68,9.12v25.6c0,3.63-1.23,6.67-3.68,9.12s-5.49,3.68-9.12,3.68-6.67-1.23-9.12-3.68c-2.45-2.45-3.68-5.49-3.68-9.12Zm153.6,51.2V64c0-3.63,1.23-6.67,3.68-9.12s5.49-3.68,9.12-3.68,6.67,1.23,9.12,3.68,3.68,5.49,3.68,9.12v128c0,3.63-1.23,6.67-3.68,9.12-2.45,2.45-5.49,3.68-9.12,3.68s-6.67-1.23-9.12-3.68c-2.45-2.45-3.68-5.49-3.68-9.12Zm51.2-51.2v-25.6c0-3.63,1.23-6.67,3.68-9.12s5.49-3.68,9.12-3.68,6.67,1.23,9.12,3.68,3.68,5.49,3.68,9.12v25.6c0,3.63-1.23,6.67-3.68,9.12s-5.49,3.68-9.12,3.68-6.67-1.23-9.12-3.68-3.68-5.49-3.68-9.12Z" />
  </svg>
);

function HoverableFeature({ icon, value, message }: { icon: JSX.Element; value: number; message: string }) {
  // https://benborgers.com/posts/tailwind-tooltip
  return (
    <div className="group relative w-max">
      <div className="flex items-center flex-row gap-2">
        {icon}
        {value}
      </div>
      <span className="pointer-events-none absolute top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-black p-3 rounded-lg">{message}</span>
    </div>
  );
}

export default function AudioFeatures({ trackIds }: { trackIds: string[] }) {
  const sdkProps = useStore(sdkPropsAtom);

  // const [acousticness, setAcousticness] = useState<number>(0);
  const [danceability, setDanceability] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [instrumentalness, setInstrumentalness] = useState<number>(0);
  // const [liveness, setLiveness] = useState<number>(0);
  const [loudness, setLoudness] = useState<number>(0);
  const [speechiness, setSpeechiness] = useState<number>(0);
  const [valence, setValence] = useState<number>(0);

  useEffect(() => {
    if (!sdkProps) return;

    const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
    if (trackIds.length === 0) return;

    trackIds = trackIds.slice(0, 100);

    sdk.tracks.audioFeatures(trackIds).then((features) => {
      if (features.length === 0) return;

      const data = {
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        loudness: 0,
        speechiness: 0,
        valence: 0,
      };

      features.forEach((feature) => {
        for (const key in data) {
          (data as any)[key] += (feature as any)[key];
        }
      });

      for (const key in data) {
        (data as any)[key] = ((data as any)[key] / features.length).toFixed(2);
      }

      setDanceability(data.danceability);
      setEnergy(data.energy);
      setInstrumentalness(data.instrumentalness);
      setLoudness(data.loudness);
      setSpeechiness(data.speechiness);
      setValence(data.valence);
    });
  }, [trackIds]);

  return (
    <>
      <section className="flex gap-3">
        <HoverableFeature icon={<DanceabilityIcon />} value={danceability} message="How much your music lends itself to dance" />
        <HoverableFeature icon={<EnergyIcon />} value={energy} message="How intense and active your music is" />
        <HoverableFeature icon={<InstrumentIcon />} value={instrumentalness} message="How instrumental focused your music is" />
        <HoverableFeature icon={<LoudnessIcon />} value={loudness} message="How loud your music is" />
        <HoverableFeature icon={<SpeechinessIcon />} value={speechiness} message="How much your music focuses on vocals" />
        <HoverableFeature icon={<ValenceIcon />} value={valence} message="How cheerful your music is" />
      </section>
    </>
  );
}
