import Trash from '../assets/trash.svg';
import Arrow2 from '../assets/dropdown-arrow.svg';
import { Doc } from '../preferences/preferenceApi';
import { useDispatch } from 'react-redux';

type Props = {
  options: Doc[] | null;
  selectedDocs: Doc | null;
  setSelectedDocs: any;
  isDocsListOpen: boolean;
  setIsDocsListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteClick: any;
};

function SourceDropdown({
  options,
  setSelectedDocs,
  selectedDocs,
  setIsDocsListOpen,
  isDocsListOpen,
  handleDeleteClick,
}: Props) {
  const dispatch = useDispatch();
  const embeddingsName =
    import.meta.env.VITE_EMBEDDINGS_NAME ||
    'huggingface_sentence-transformers/all-mpnet-base-v2';

  const handleEmptyDocumentSelect = () => {
    dispatch(setSelectedDocs(null));
    setIsDocsListOpen(false);
  };

  return (
    <div className="relative w-5/6 rounded-3xl">
      <button
        onClick={() => setIsDocsListOpen(!isDocsListOpen)}
        className={`flex w-full cursor-pointer items-center border border-silver bg-white p-[14px] dark:bg-transparent ${
          isDocsListOpen
            ? 'rounded-t-3xl dark:border-silver/40'
            : 'rounded-3xl dark:border-purple-taupe'
        }`}
      >
        <span className="ml-1 mr-2 flex-1 overflow-hidden text-ellipsis text-left dark:text-bright-gray">
          <div className="flex flex-row gap-2">
            <p className="max-w-3/4 truncate whitespace-nowrap">
              {selectedDocs?.name || 'None'}
            </p>
            <p className="flex flex-col items-center justify-center">
              {selectedDocs?.version}
            </p>
          </div>
        </span>
        <img
          src={Arrow2}
          alt="arrow"
          className={`transform ${
            isDocsListOpen ? 'rotate-180' : 'rotate-0'
          } h-3 w-3 transition-transform`}
        />
      </button>
      {isDocsListOpen && (
        <div className="absolute left-0 right-0 z-50 -mt-1 max-h-40 overflow-y-auto rounded-b-xl border border-silver bg-white shadow-lg dark:border-silver/40 dark:bg-dark-charcoal">
          {options ? (
            options.map((option: any, index: number) => {
              if (option.model === embeddingsName) {
                return (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center justify-between hover:bg-gray-100 dark:text-bright-gray dark:hover:bg-purple-taupe"
                    onClick={() => {
                      dispatch(setSelectedDocs(option));
                      setIsDocsListOpen(false);
                    }}
                  >
                    <span
                      onClick={() => {
                        setIsDocsListOpen(false);
                      }}
                      className="ml-4 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap py-3"
                    >
                      {option.name}
                    </span>
                    {option.location === 'local' && (
                      <img
                        src={Trash}
                        alt="Delete"
                        className="mr-4 h-4 w-4 cursor-pointer hover:opacity-50"
                        id={`img-${index}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClick(index, option);
                        }}
                      />
                    )}
                  </div>
                );
              }
            })
          ) : (
            <div className="h-10 w-full cursor-pointer  border-b-[1px] hover:bg-gray-100 dark:border-b-purple-taupe dark:hover:bg-purple-taupe">
              <p className="ml-5 py-3">No default documentation.</p>
            </div>
          )}
          <div
            className="flex cursor-pointer items-center justify-between hover:bg-gray-100 dark:text-bright-gray dark:hover:bg-purple-taupe"
            onClick={handleEmptyDocumentSelect}
          >
            <span className="ml-4 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap py-3">
              None
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SourceDropdown;
