import { APP_DEFAULT_PATH } from 'config/config';
import { useLocation } from 'react-router-dom';

import React from 'react';
import PageTitle from 'components/PageTitle';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import ArticleForm from 'sections/portal/modules/articles/Form';

const ArticleFormPage = () => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const id = searchParams.get('id');
	const isEdit = Boolean(id);

	const breadcrumbLinks = [
		{ title: 'Home', to: APP_DEFAULT_PATH },
		{ title: 'Articles', to: '/portal/content-management/articles' },
		{ title: isEdit ? 'Edit' : 'Add' }
	];

	return (
		<React.Fragment>
			<PageTitle title={isEdit ? 'Edit Article' : 'Add Article'} />
			<Breadcrumbs
				custom
				heading={isEdit ? 'Edit Article' : 'Add Article'}
				links={breadcrumbLinks}
				subheading="Create and manage articles for the resort."
			/>
			<ArticleForm id={id} />
		</React.Fragment>
	);
};

export default ArticleFormPage;
