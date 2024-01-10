import { XCircleIcon } from '@heroicons/react/solid';

export const Alerts = (props: any) => {
  return (
    <div className={`rounded-md bg-${props.type}-50 p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className={`h-5 w-5 text-${props.type}-400`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium text-${props.type}-800`}>{props.title}</h3>
          <div className={`mt-2 text-sm text-${props.type}-700`}>{props.description}</div>
        </div>
      </div>
    </div>
  );
};
