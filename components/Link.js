/**
 * Created on 1/18/21 by jovialis (Dylan Hanson)
 **/

//https://github.com/mui-org/material-ui/blob/master/examples/nextjs/src/Link.js
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';
import {makeStyles} from "@material-ui/core";

const NextComposed = React.forwardRef(function NextComposed(props, ref) {
    const { as, href, ...other } = props;

    return (
        <NextLink href={href} as={as}>
            <a ref={ref} {...other} />
        </NextLink>
    );
});

NextComposed.propTypes = {
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    prefetch: PropTypes.bool,
};

const useStyles = makeStyles({
    root: {
        color: 'inherit',
        textDecoration: 'underline'
    }
});

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link(props) {
    const {
        href,
        activeClassName = 'active',
        className: classNameProps,
        innerRef,
        naked,
        ...other
    } = props;

    const defaultClasses = useStyles();

    const router = useRouter();
    const pathname = typeof href === 'string' ? href : href.pathname;
    const className = clsx(defaultClasses.root, classNameProps, {
        [activeClassName]: router.pathname === pathname && activeClassName,
    });

    if (naked) {
        return <NextComposed className={className} ref={innerRef} href={href} {...other} />;
    }

    return (
        <MuiLink component={NextComposed} className={className} ref={innerRef} href={href} {...other} />
    );
}

Link.propTypes = {
    activeClassName: PropTypes.string,
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    naked: PropTypes.bool,
    onClick: PropTypes.func,
    prefetch: PropTypes.bool,
};

export default React.forwardRef((props, ref) => <Link {...props} innerRef={ref} />);