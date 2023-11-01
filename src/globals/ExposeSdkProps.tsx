import type { SdkProps } from "../middleware";
import { sdkPropsAtom } from "./store";

export default function ExposeSdkProps({sdkProps}: {sdkProps: SdkProps}) {
  sdkPropsAtom.set(sdkProps)
  return <></>
}