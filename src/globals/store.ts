import { atom } from "nanostores";
import type { SdkProps } from "../middleware";

export const sdkPropsAtom = atom<SdkProps | undefined>();