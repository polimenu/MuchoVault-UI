import { Chain } from "wagmi";
import { Section } from "../Card/Section";
import { useGetUserHasNFT } from "../Hooks/useNFTCall";

export const OnlyNFT = ({ nftAllowed, child, heading, activeChain }: { nftAllowed: number[], child: JSX.Element, heading: JSX.Element, activeChain: Chain }) => {
    const hasNFT = import.meta.env.VITE_MODE !== 'production' || useGetUserHasNFT(nftAllowed, activeChain);
    const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

    if (!hasNFT) {

        return (<>
            <Section
                Heading={heading}
                subHeading={<></>}
                other={<div className={`${descStyles} text-f16 m-auto`}>This content is only available for some NFT subscribers</div>}
            />
        </>
        );
    }

    return child;
}