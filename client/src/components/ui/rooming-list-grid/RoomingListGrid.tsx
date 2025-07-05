'use client';
import { RoomingList } from '@/interfaces/rooming-list-res';
import { RoomingListCard } from '@/components';

interface Props {
  roomingList: RoomingList[];
  loading: boolean;
}

export const RoomingListGrid = ({ roomingList, loading }: Props) => {
  // Validate that the passed prop is an array to avoid runtime errors
  if (!Array.isArray(roomingList)) {
    console.error('roomingList is not an array:', roomingList);
    return <div>Error al cargar datos.</div>;
  }

  // Separate rooming lists into two groups based on event_id (for different event sections)
  const firstRow = roomingList.filter((item) => item.event_id === 1);
  const secondRow = roomingList.filter((item) => item.event_id === 2);

  return (
    <div className='w-full px-4 sm:px-6 md:px-8 lg:px-10 space-y-12 max-w-screen-xl mx-auto'>
      {loading ? (
        <p className='text-center'>Loading...</p>
      ) : (
        <>
          {[
            { title: 'Austin City Limits', color: '#00c2a6', items: firstRow },
            {
              title: 'Ultra Musical Festival',
              color: '#8438ff',
              items: secondRow,
            },
          ].map(({ title, color, items }, i) => (
            <div key={i} className='space-y-4 sm:space-x-4 sm:space-y-0'>
              {/* Header with lines */}
              <div className='flex items-center justify-center sm:w-[50%] md:w-[65%] lg:w-[100%]'>
                <div
                  className='flex-grow border-t mx-2'
                  style={{ borderColor: color }}
                />
                <h2
                  className='text-sm font-semibold text-center whitespace-nowrap px-6 py-1 rounded shadow-sm'
                  style={{ color: color }}
                >
                  {title}
                </h2>
                <div
                  className='flex-grow border-t mx-2'
                  style={{ borderColor: color }}
                />
              </div>

              {/* Container holding the list of RoomingListCards */}
              <div
                className='
                  flex sm:flex-row flex-col
                  sm:space-x-4 space-y-4 sm:space-y-0
                  overflow-x-auto sm:overflow-x-scroll
                  scrollbar-thin scrollbar-thumb-gray-300
                  transition-all duration-300 ease-in-out
                '
              >
                {/* Render each rooming list as a RoomingListCard */}
                {items.map((item) => (
                  <RoomingListCard key={item.rooming_list_id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
