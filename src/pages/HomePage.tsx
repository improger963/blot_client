import { useQuery } from '@tanstack/react-query';
import { fetchGameRooms, fetchTournaments } from '../services/dataService';

export const HomePage = () => {
    const { data: gameRoomsData, isLoading: isLoadingGameRooms } = useQuery({
        queryKey: ['gameRooms'],
        queryFn: fetchGameRooms,
    });

    const { data: tournamentsData, isLoading: isLoadingTournaments } = useQuery({
        queryKey: ['tournaments'],
        queryFn: fetchTournaments,
    });

    const isLoading = isLoadingGameRooms || isLoadingTournaments;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">Игровые комнаты</h2>
                {isLoading ? (
                    <p>Загрузка комнат...</p> // Здесь будут скелетоны
                ) : (
                    <pre className="bg-gray-100 p-4 rounded-md">
                        {JSON.stringify(gameRoomsData, null, 2)}
                    </pre>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Турниры</h2>
                {isLoading ? (
                    <p>Загрузка турниров...</p> // Здесь будут скелетоны
                ) : (
                    <pre className="bg-gray-100 p-4 rounded-md">
                        {JSON.stringify(tournamentsData, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};