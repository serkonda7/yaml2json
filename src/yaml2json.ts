import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'

type Args = {
	out_dir: string
	yml_files: string[]
}

const parse_cli_args = (args: string[]): Args => {
	const res: Args = {
		out_dir: 'out',
		yml_files: []
	}
	for (let i = 0; i < args.length; i++) {
		const arg = args[i]
		if (arg === '-o' || arg === '--out') {
			i++
			res.out_dir = args[i]
			continue
		}
		res.yml_files.push(arg)
	}
	res.out_dir = path.resolve(process.cwd(), res.out_dir)
	return res
}

const get_final_out_path = (out_dir: string, inpath: string): string => {
	const out_path = path.join(out_dir, path.basename(inpath))
	return out_path.replace('.yml', '.json')
}

const convert_file = (yml_path: string, out_dir: string) => {
	const yml_txt = fs.readFileSync(yml_path, 'utf8')
	const obj = yaml.load(yml_txt)
	const json_txt = JSON.stringify(obj) + '\n'
	fs.writeFileSync(get_final_out_path(out_dir, yml_path), json_txt)
}

const main = () => {
	const args = parse_cli_args(process.argv.slice(2))

	if (!fs.existsSync(args.out_dir)) {
		fs.mkdirSync(args.out_dir)
	}

	for (const p of args.yml_files) {
		try {
			convert_file(p, args.out_dir)
		} catch (e) {
			console.log(e)
		}
	}
}

main()
