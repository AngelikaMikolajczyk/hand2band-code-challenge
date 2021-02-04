import { SearchInput } from './SearchInput';

export function Main() {
    return (
        <div className="h-screen flex flex-col justify-center items-center gap-16 p-8">
            <h1 className="md:text-5xl text-3xl font-semibold text-center">
                HAND<span className="text-green-600">2</span>BAND.MEDIA code challenge
            </h1>
            <SearchInput />
            <div className="italic text-lg font-normal">By Angelika Mikołajczyk</div>
        </div>
    );
}
