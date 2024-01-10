import PropTypes from 'prop-types';
/**
 *
 *
 * @param {*} { title, moduleDescription, children }
 * @param children: (Optional) Receive component from parent
 */
export const Titles = ({ title, moduleDescription, children }: any) => {
  return (
    <div className="w-full grid grid-flow-col	p-5 px-10 bg-accentSection title-box-shadow">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        <p className="text-primary" style={{ color: 'rgba(34, 51, 84, 0.7)' }}>
          {moduleDescription}
        </p>
      </div>
      <div className="w-auto self-end flex justify-end	">{children}</div>
    </div>
  );
};

// Props Required
Titles.propTypes = {
  title: PropTypes.string.isRequired,
  moduleDescription: PropTypes.string.isRequired,
  children: PropTypes.node,
};
